import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const Modal = ({ isOpen, onOpenChange, title, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader className={"bg-[#14805e] text-white rounded-t-lg"}>
          <DialogTitle className="text-xl px-6 py-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-8 bg-white">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
