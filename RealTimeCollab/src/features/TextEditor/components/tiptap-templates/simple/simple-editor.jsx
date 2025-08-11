import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useScrolling } from "@/hooks/use-scrolling";

// --- Components ---

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import content from "@/components/tiptap-templates/simple/data/content.json";
import useWebSocket from "./useWebSocket";

// Memoized toolbar components to prevent unnecessary re-renders
const MainToolbarContent = React.memo(
  ({ onHighlighterClick, onLinkClick, isMobile }) => {
    return (
      <>
        <Spacer />
        <ToolbarGroup>
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
          <ListDropdownMenu
            types={["bulletList", "orderedList", "taskList"]}
            portal={isMobile}
          />
          <BlockquoteButton />
          <CodeBlockButton />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
          <MarkButton type="underline" />
          {!isMobile ? (
            <ColorHighlightPopover />
          ) : (
            <ColorHighlightPopoverButton onClick={onHighlighterClick} />
          )}
          {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <MarkButton type="superscript" />
          <MarkButton type="subscript" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
          <TextAlignButton align="justify" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ImageUploadButton text="Add" />
        </ToolbarGroup>
        <Spacer />
        {isMobile && <ToolbarSeparator />}
        <ToolbarGroup>
        </ToolbarGroup>
      </>
    );
  },
);

const MobileToolbarContent = React.memo(({ type, onBack }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
));

function SimpleEditor() {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState("main");
  const toolbarRef = React.useRef(null);

  // Ref to track if component is mounted to prevent stale closures
  const isMountedRef = React.useRef(false);

  // Ref to track if we're currently updating from WebSocket to prevent feedback loops
  const isUpdatingFromWebSocket = React.useRef(false);

  // Debounce timer for WebSocket publishing
  const publishTimeoutRef = React.useRef(null);

  // Store last published content to prevent duplicate sends
  const lastPublishedContent = React.useRef(null);

  // Use ref to store editor instance for WebSocket callback
  const editorRef = React.useRef(null);

  // Store current cursor position to preserve it during updates
  const cursorPositionRef = React.useRef(null);

  // Helper function to apply changes without losing cursor position
  const applyContentChanges = React.useCallback((newContent) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Store current selection/cursor position
    const currentSelection = editor.state.selection;
    cursorPositionRef.current = {
      from: currentSelection.from,
      to: currentSelection.to,
      anchor: currentSelection.anchor,
      head: currentSelection.head,
    };

    // Get current content for comparison
    const currentContent = editor.getJSON();

    // Check if content has actually changed to avoid unnecessary updates
    if (JSON.stringify(currentContent) === JSON.stringify(newContent)) {
      return;
    }

    // Use a transaction to update content while preserving history
    editor.view.dispatch(
      editor.state.tr.replaceWith(
        0,
        editor.state.doc.content.size,
        editor.schema.nodeFromJSON(newContent).content,
      ),
    );

    // Restore cursor position after a brief delay
    if (
      editorRef.current &&
      cursorPositionRef.current &&
      isMountedRef.current
    ) {
      try {
        const { from, to } = cursorPositionRef.current;
        const docSize = editorRef.current.state.doc.content.size;

        // Ensure positions are within document bounds
        const safeFrom = Math.min(from, docSize);
        const safeTo = Math.min(to, docSize);

        // Restore selection
        editorRef.current.commands.setTextSelection({
          from: safeFrom,
          to: safeTo,
        });
      } catch (error) {
        // If restoration fails, just place cursor at a safe position
        console.warn("Could not restore cursor position:", error);
      }
    }
  }, []);

  // Stable callback for handling WebSocket messages
  const onWrite = React.useCallback(
    (message) => {
      // Early return if component is unmounted
      if (!isMountedRef.current) return;

      try {
        const parsedContent = JSON.parse(message.body);

        if (editorRef.current && !isUpdatingFromWebSocket.current) {
          // Set flag to prevent feedback loop
          isUpdatingFromWebSocket.current = true;

          // Apply changes while preserving cursor position
          applyContentChanges(parsedContent);

          // Store the content we just received
          lastPublishedContent.current = JSON.stringify(parsedContent);

          // Reset flag after a short delay, but only if still mounted
          setTimeout(() => {
            if (isMountedRef.current) {
              isUpdatingFromWebSocket.current = false;
            }
          }, 100);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [applyContentChanges], // Include applyContentChanges in dependencies
  );

  // Initialize WebSocket connection
  const { client } = useWebSocket(onWrite);

  // Debounced publish function to prevent too many WebSocket messages
  const publishContent = React.useCallback(
    (content) => {
      if (!client || isUpdatingFromWebSocket.current) return;

      const contentString = JSON.stringify(content);

      // Don't publish if content hasn't changed
      if (contentString === lastPublishedContent.current) return;

      // Clear existing timeout
      if (publishTimeoutRef.current) {
        clearTimeout(publishTimeoutRef.current);
      }

      // Debounce the publish call
      publishTimeoutRef.current = setTimeout(() => {
        try {
          client.publish({
            destination: "/app/writing",
            body: contentString,
          });
          lastPublishedContent.current = contentString;
        } catch (error) {
          console.error("Failed to publish content:", error);
        }
      }, 300); // 300ms debounce
    },
    [client],
  );

  // Initialize editor with optimized configuration
  const editor = useEditor({
    onUpdate({ editor }) {
      // Only publish if component is mounted and not updating from WebSocket
      if (isMountedRef.current && !isUpdatingFromWebSocket.current) {
        const content = editor.getJSON();
        publishContent(content);
      }
    },
    onCreate({ editor }) {
      // Store editor reference when created
      editorRef.current = editor;
    },
    onDestroy() {
      // Clean up editor reference
      editorRef.current = null;
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  });

  // Memoized toolbar event handlers to prevent re-renders
  const handleHighlighterClick = React.useCallback(() => {
    setMobileView("highlighter");
  }, []);

  const handleLinkClick = React.useCallback(() => {
    setMobileView("link");
  }, []);

  const handleBackClick = React.useCallback(() => {
    setMobileView("main");
  }, []);

  const isScrolling = useScrolling();
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  // Effect to track component mount status and handle cleanup
  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Clean up any pending timeouts
      if (publishTimeoutRef.current) {
        clearTimeout(publishTimeoutRef.current);
      }
    };
  }, []);

  // Effect to handle mobile view changes
  React.useEffect(() => {
    if (!isMountedRef.current) return;

    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  // Cleanup effect for timeout (keeping this as backup)
  React.useEffect(() => {
    return () => {
      if (publishTimeoutRef.current) {
        clearTimeout(publishTimeoutRef.current);
      }
    };
  }, []);

  // Memoized toolbar styles to prevent recalculation
  const toolbarStyles = React.useMemo(
    () => ({
      ...(isScrolling && isMobile
        ? { opacity: 0, transition: "opacity 0.1s ease-in-out" }
        : {}),
      ...(isMobile
        ? {
            bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
          }
        : {}),
    }),
    [isScrolling, isMobile, windowSize.height, rect.y],
  );

  return (
    <>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar ref={toolbarRef} style={toolbarStyles}>
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={handleHighlighterClick}
              onLinkClick={handleLinkClick}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={handleBackClick}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </>
  );
}

// Set display names for debugging
MainToolbarContent.displayName = "MainToolbarContent";
MobileToolbarContent.displayName = "MobileToolbarContent";

export default React.memo(SimpleEditor);
