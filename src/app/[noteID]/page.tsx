"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FiEdit, FiMoreHorizontal, FiLoader, FiArchive, FiCopy, FiTrash } from "react-icons/fi";

interface NotePageProps {
  params: {
    noteID: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const { noteID } = params;
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages = [
    "Believe in yourself, you are capable of amazing things.",
    "Every day is a new opportunity to grow and improve.",
    "You are stronger than you think.",
    "Don't be afraid to be great. You have it in you.",
    "Keep pushing forward, even when it's tough.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Be kind to yourself and take things one step at a time.",
    "Your potential is endless. Go do what you were created to do.",
  ];

  useEffect(() => {
    // ランダムメッセージを選択
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);

    const fetchNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, "notes", noteID));
        if (!noteDoc.exists()) {
          router.push("/");
          return;
        }

        const noteData = noteDoc.data();
        setNoteContent(noteData?.content || "");
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [messages, noteID, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditOrSave = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        await updateDoc(doc(db, "notes", noteID), { content: noteContent });
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving note:", error);
        alert("Failed to save the note.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => alert("URL copied to clipboard!"),
      () => alert("Failed to copy URL.")
    );
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "notes", noteID));
      router.push("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete the note.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="mb-10 md:w-full md:max-w-md mx-4 md:mx-auto">
      <div className="flex items-center bg-white sticky top-0 py-5">
        <h1 className="text-2xl font-bold">{noteID}</h1>
        <div className="ml-auto flex items-center relative">
          <button
            onClick={handleEditOrSave}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 flex items-center ring-offset-2 rounded-r-none focus-visible:z-10"
          >
            {isEditing ? (
              <>
                {loading ? (
                  <FiLoader className="animate-spin mr-2" />
                ) : (
                  <FiArchive className="mr-2" />
                )}
                Save
              </>
            ) : (
              <>
                <FiEdit className="mr-2" /> Edit
              </>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="h-10 px-3 bg-white text-green-500 border border-green-500 flex items-center rounded-lg shadow outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2 rounded-l-none"
            >
              <FiMoreHorizontal />
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2.5 w-40 bg-white border rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={handleCopyURL}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center"
                >
                  <FiCopy className="mr-2" /> Copy URL
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center"
                >
                  <FiTrash className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-5">
        <p className="italic">{randomMessage}</p>
      </div>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        disabled={!isEditing}
        className={`w-full h-64 p-5 border rounded-lg outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 duration-200 shadow-inner ring-offset-2 ${
          isEditing ? "" : "bg-gray-100"
        }`}
        placeholder="Enter your note here..."
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-5">Delete Note</h2>
            <p>Are you sure you want to delete this note?</p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {loading ? <FiLoader className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}