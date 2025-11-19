import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

export function AddReferralModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      formRef.current?.reset();
      setDefaultParentId(null);
      onClose();
      // Refresh the page to show the new referral
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      setDefaultParentId(ev?.detail?.parentId ?? null);
      onOpen();
    };

    window.addEventListener("openAddReferral", handler as EventListener);
    return () => window.removeEventListener("openAddReferral", handler as EventListener);
  }, [onOpen]);

  const handleClose = () => {
    setDefaultParentId(null);
    formRef.current?.reset();
    onClose();
  };

  return (
    <>
      <Button onPress={onOpen}>Add</Button>
      <Modal isOpen={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else onOpenChange(open);
    }} placement="top-center">
        <ModalContent>
          {(modalOnClose) => (
            <fetcher.Form ref={formRef} method="POST" className="contents">
              <ModalHeader className="flex justify-center">
                New Agent
              </ModalHeader>
              <ModalBody>
                {fetcher.data?.error && (
                  <p className="text-red-500 text-sm" role="alert">
                    {fetcher.data.error}
                  </p>
                )}
                <input type="hidden" name="referralParentId" value={defaultParentId ?? ""} />
                <fieldset className="flex flex-col gap-4">
                  <legend className="font-semibold mb-4">
                    Personal Information
                  </legend>

                  <div className="flex gap-4">
                    <Input name="firstName" label="First name" required />
                    <Input name="lastName" label="Last name" required />
                  </div>

                  <Input name="phone" label="Phone" required />
                </fieldset>

                <fieldset className="flex flex-col gap-4">
                  <legend className="font-semibold mb-4">Access Details</legend>

                  <Input name="username" label="Username" required />

                  <div className="flex gap-4">
                    <Input
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                    <Input
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      required
                    />
                  </div>
                </fieldset>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={handleClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={fetcher.state !== "idle"}
                >
                  Save
                </Button>
              </ModalFooter>
            </fetcher.Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
