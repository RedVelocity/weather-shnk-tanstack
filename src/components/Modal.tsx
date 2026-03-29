import {
  Dialog,
  DialogDismiss,
  DialogHeading,
  useDialogStore,
  useStoreState,
} from '@ariakit/react';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';

type ModalProps = {
  heading: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  layoutId?: string;
};

const Modal = ({ heading, children, open, setOpen, layoutId }: ModalProps) => {
  const dialog = useDialogStore({
    open,
    setOpen,
  });

  const mounted = useStoreState(dialog, 'mounted');

  return (
    <AnimatePresence>
      {mounted && (
        <Dialog
          store={dialog}
          alwaysVisible
          className="fixed inset-0 z-50 w-full max-w-md"
          backdrop={
            <motion.div
              className="backdrop-blur-xs bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          }
          render={
            <motion.div
              className="flex flex-col items-center justify-center gap-2 p-4 m-auto overflow-auto w-fit h-fit wrapper card backdrop-blur"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layoutId={layoutId}
            />
          }
        >
          <DialogDismiss className="absolute dark:saturate-75 top-0 right-0 z-20 h-8 sm:h-10 card aspect-square bg-[#BF392B] focus:ring-0">
            <img
              src="https://ik.imagekit.io/redvelocity/assets/icons/tr:w-50,h-50/close.png"
              className="w-full h-full"
              alt="Remove Favorite"
              sizes="2rem"
            />
          </DialogDismiss>
          <DialogHeading className="mb-2 text-2xl font-semibold">
            {heading}
          </DialogHeading>
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;
