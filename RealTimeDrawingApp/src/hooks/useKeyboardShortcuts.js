// hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from "react";

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onToggleEraser,
  onResetView,
  onZoomIn,
  onZoomOut,
  onSelectPen,
  onTogglePan,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      // Prevent shortcuts when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + Z - Undo
      if (ctrlOrCmd && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (ctrlOrCmd && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // E - Toggle eraser
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        onToggleEraser?.();
        return;
      }

      // P or V - Select pen tool
      if (e.key === "p" || e.key === "P" || e.key === "v" || e.key === "V") {
        e.preventDefault();
        onSelectPen?.();
        return;
      }

      // Space - Pan mode (hold)
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        onTogglePan?.(true);
        return;
      }

      // Ctrl/Cmd + 0 - Reset view
      if (ctrlOrCmd && e.key === "0") {
        e.preventDefault();
        onResetView?.();
        return;
      }

      // Ctrl/Cmd + Plus/Equal - Zoom in
      if (ctrlOrCmd && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        onZoomIn?.();
        return;
      }

      // Ctrl/Cmd + Minus - Zoom out
      if (ctrlOrCmd && e.key === "-") {
        e.preventDefault();
        onZoomOut?.();
        return;
      }

    //   // Numbers 1-9 for zoom levels
    //   if (!ctrlOrCmd && /^[1-9]$/.test(e.key)) {
    //     e.preventDefault();
    //     const zoomLevel = parseInt(e.key) * 0.2; // 1=20%, 2=40%, etc., 5=100%
    //     onZoomTo?.(zoomLevel);
    //     return;
    //   }

    //   // Escape - Cancel current action
    //   if (e.key === "Escape") {
    //     e.preventDefault();
    //     onEscape?.();
    //     return;
    //   }

    //   // Delete/Backspace - Delete selected (if any)
    //   if (e.key === "Delete" || e.key === "Backspace") {
    //     e.preventDefault();
    //     onDelete?.();
    //     return;
    //   }
    },
    [
      onUndo,
      onRedo,
      onToggleEraser,
      onResetView,
      onZoomIn,
      onZoomOut,
      onSelectPen,
      onTogglePan,
    ]
  );

  const handleKeyUp = useCallback(
    (e) => {
      // Space - Stop pan mode
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        onTogglePan?.(false);
        return;
      }
    },
    [onTogglePan]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
