import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Drawer } from "vaul";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

interface ModalProps {
  children?: ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
}

/**
 * Modal component that adapts between Drawer and Dialog components
 * based on screen size. Allows for conditional close behavior and
 * desktop-only display.
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
  const closeModal = ({ dragged }: { dragged?: boolean }) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    onClose?.();
    setShowModal?.(false);
  };

  const { isMobile } = useMediaQuery();

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
              "fixed h-[90vh] left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white !max-w-[95%] md:!max-w-[80%] lg:!max-w-[50%]",
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

  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) closeModal({ dragged: true });
      }}
    >
      <DialogTitle className="sr-only">Dialog</DialogTitle>
      <DialogContent className="h-[80vh] !max-w-[95%] md:!max-w-[80%] lg:!max-w-[70%]">
        {children}
      </DialogContent>
    </Dialog>
  );
};