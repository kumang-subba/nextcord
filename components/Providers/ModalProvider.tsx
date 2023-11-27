"use client";

import CreateServerModal from "@/components/Modals/CreateServerModal";
import { Toaster } from "react-hot-toast";
import UserSettingsModal from "@/components/Modals/UserSettingsModal";
import InviteModal from "@/components/Modals/InviteModal";
import EditServerModal from "@/components/Modals/EditServerModal";
import MembersModal from "@/components/Modals/MembersModal";
import CreateChannelModal from "@/components/Modals/CreateChannelModal";
import DeleteServerModal from "@/components/Modals/DeleteServerModal";
import LeaveServerModal from "@/components/Modals/LeaveServerModal";
import EditChannelModal from "@/components/Modals/EditChannelModal";
import DeleteChannelModal from "@/components/Modals/DeleteChannelModal";
import DeleteMessageModal from "../Modals/DeleteMessageModal";
import ImageModal from "../Modals/ImageModal";

const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <UserSettingsModal />
      <EditServerModal />
      <InviteModal />
      <MembersModal />
      <CreateChannelModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
      <ImageModal />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ModalProvider;
