"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FiEdit, FiMoreHorizontal, FiLoader, FiArchive, FiCopy, FiTrash } from "react-icons/fi";
import { format } from "date-fns";

interface NotePageProps {
  params: {
    noteID: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const { noteID } = params;
  const [noteContent, setNoteContent] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false); // New state for the copy modal
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, "notes", noteID));
        if (!noteDoc.exists()) {
          router.push("/");
          return;
        }

        const noteData = noteDoc.data();
        setNoteContent(noteData?.content || "");

        // Get and format the creation date
        const createdAtTimestamp = noteData?.createdAt;
        if (createdAtTimestamp) {
          const date = createdAtTimestamp.toDate(); // Convert Firestore Timestamp to Date
          setCreatedAt(format(date, "yyyy-MM-dd HH:mm:ss")); // Format
        } else {
          setCreatedAt("Unknown");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteID, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
      () => setShowCopyModal(true), // Show the copy modal instead of alert
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
              ref={buttonRef}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="h-10 px-3 bg-white text-green-500 border border-green-500 flex items-center rounded-lg shadow outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2 rounded-l-none"
            >
              <FiMoreHorizontal />
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-lg dropdown"
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
        <p>Created: {createdAt || "Loading..."}</p>
      </div>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        disabled={!isEditing}
        className={`w-full h-64 p-5 border rounded-lg outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 duration-200 shadow-inner ring-offset-2 ${
          isEditing ? "" : "bg-gray-50 opacity-100"
        }`}
        placeholder="Enter your note here..."
      />

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-5">Delete Note</h2>
            <p>Are you sure you want to delete this note?</p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg mr-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 flex items-center ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 flex items-center ring-offset-2"
              >
                {loading ? <><FiLoader className="animate-spin mr-2" />Delete</> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-5">Copy URL</h2>
            <p>URL copied to clipboard!</p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 flex items-center ring-offset-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}