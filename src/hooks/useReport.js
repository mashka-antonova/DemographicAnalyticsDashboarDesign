import { useState, useRef, useCallback } from "react";
import { generateReport, pollReportStatus, fetchReportContent, downloadReport } from "../api/reports";

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL_MS = 2000;

export function useReport() {
  const [taskId, setTaskId] = useState(null);
  const [reportStatus, setReportStatus] = useState("idle"); // idle | pending | processing | completed | error
  const [progress, setProgress] = useState(0);
  const [reportHtml, setReportHtml] = useState(null);
  const [reportError, setReportError] = useState(null);
  const pollRef = useRef(null);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    attemptsRef.current = 0;
  }, []);

  const startPolling = useCallback(
    (id, context) => {
      attemptsRef.current = 0;
      pollRef.current = setInterval(async () => {
        attemptsRef.current += 1;
        if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
          stopPolling();
          setReportStatus("error");
          setReportError("Нейросеть не ответила. Попробуйте снова.");
          return;
        }
        try {
          const statusResult = await pollReportStatus(id);
          if (statusResult.status === "processing") {
            setProgress(statusResult.progress ?? Math.min(90, attemptsRef.current * 3));
          }
          if (statusResult.status === "completed") {
            stopPolling();
            setProgress(100);
            const html = await fetchReportContent(id, context);
            setReportHtml(html);
            setReportStatus("completed");
          }
        } catch (err) {
          stopPolling();
          setReportStatus("error");
          setReportError(err.message ?? "Ошибка при получении статуса отчёта");
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const generate = useCallback(
    async ({ moId, horizon, regionName, moName }) => {
      stopPolling();
      setReportStatus("pending");
      setReportHtml(null);
      setReportError(null);
      setProgress(0);
      try {
        const { task_id } = await generateReport({ moId, horizon, regionName, moName });
        setTaskId(task_id);
        setReportStatus("processing");
        startPolling(task_id, { regionName, moName, horizon });
      } catch (err) {
        setReportStatus("error");
        setReportError(err.message ?? "Ошибка при запуске генерации отчёта");
      }
    },
    [startPolling, stopPolling]
  );

  const handleDownload = useCallback(
    async (format = "pdf") => {
      if (!taskId) return;
      try {
        await downloadReport(taskId, format);
        // TODO: Когда downloadReport вернёт blob — создать object URL и скачать файл:
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a"); a.href = url; a.download = `report.${format}`; a.click();
        alert(`Скачивание ${format.toUpperCase()} будет доступно после подключения бэкенда.`);
      } catch (err) {
        setReportError(err.message ?? "Ошибка при скачивании отчёта");
      }
    },
    [taskId]
  );

  return {
    taskId,
    reportStatus,
    progress,
    reportHtml,
    reportError,
    generate,
    handleDownload,
  };
}
