import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const OppsModal = ({ isOpen, onOpenChange, title, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader className={"bg-green-500 text-white rounded-t-lg"}>
          <DialogTitle className="text-xl px-6 py-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="p-8">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default OppsModal;
