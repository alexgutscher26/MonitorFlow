import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Drawer } from "vaul";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

interface ModalProps {
  /** The content of the modal */
  children?: ReactNode;
  /** Additional classes for styling */
  className?: string;
  /** Controls modal visibility */
  showModal?: boolean;
  /** Setter for modal visibility state */
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  /** Callback fired on modal close */
  onClose?: () => void;
  /** If true, modal is shown only on desktop */
  desktopOnly?: boolean;
  /** Prevents default close behavior unless dragged */
  preventDefaultClose?: boolean;
}

/**
 * Modal component that adapts between Drawer and Dialog components
 * based on screen size. Allows for conditional close behavior and
 * desktop-only display.
 *
 * @param {ModalProps} props - Props for configuring the modal component.
 * @returns {JSX.Element} Rendered modal component.
 */
export const Modal = ({
  children,
  className,
  desktopOnly,
  onClose,
  preventDefaultClose,
  setShowModal,
  showModal,
}: ModalProps) => {
  /** Close the modal, conditionally preventing close if dragged */
  const closeModal = ({ dragged }: { dragged?: boolean }) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    onClose?.();
    setShowModal?.(false);
  };

  /** Checks if the device is mobile */
  const { isMobile } = useMediaQuery();

  /** Render Drawer on mobile or when desktop-only is disabled */
  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) closeModal({ dragged: true });
        }}
      >
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed !max-w-[95%] md:!max-w-[80%] lg:!max-w-[70%] h-[90vh] left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white",
              className
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  /** Render Dialog for desktop or if desktop-only is true */
  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) closeModal({ dragged: true });
      }}
    >
      <DialogTitle className="sr-only">Dialog</DialogTitle>
      <DialogContent className="!max-w-[95%] md:!max-w-[80%] lg:!max-w-[70%] h-[80vh] pb-10">
        {children}
      </DialogContent>
    </Dialog>
  );
};
