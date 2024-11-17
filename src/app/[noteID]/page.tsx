"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FiEdit, FiMoreHorizontal, FiLoader, FiArchive, FiCopy, FiTrash } from "react-icons/fi";
import { format } from "date-fns";
import { marked } from "marked";
import { FiHelpCircle, FiMenu } from "react-icons/fi";
import Link from "next/link";

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
  const [showCopyModal, setShowCopyModal] = useState(false);
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

        const createdAtTimestamp = noteData?.createdAt;
        if (createdAtTimestamp) {
          const date = createdAtTimestamp.toDate();
          setCreatedAt(format(date, "yyyy-MM-dd")); // フォーマットを変更
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
      () => setShowCopyModal(true),
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
    <>
    <div className="md:w-3/4 mx-4 md:mx-auto py-4 flex items-center justify-between text-2xl">
      <FiMenu />
      <Link href="/help">
        <FiHelpCircle />
      </Link>
    </div>
    <div className="md:w-3/4 mx-4 md:mx-auto">
      <div className="flex items-center sticky top-0 p-4 z-50">
        <div className="flex items-center border w-full rounded-full px-4 py-2 bg-white">
        <div className="flex items-center">
        <img src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${noteID}&backgroundColor=22c55e&eyesColor=22c55e&mouthColor=22c55e&shapeColor=ffffff`} alt="thumbs" className="rounded-full border border-green-500 w-10 mr-2 float-up-2-animation select-none" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{noteID}</h1>
            <p className="text-sm opacity-25 select-none">{createdAt || "Loading..."}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center relative shadow rounded-full">
          <button
            onClick={handleEditOrSave}
            disabled={loading}
            className="hidden  px-4 py-2 bg-green-500 text-white rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 md:flex items-center ring-offset-2 rounded-r-none focus-visible:z-10"
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
                <FiEdit className="mr-2" />Edit
              </>
            )}
          </button>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowDropdown((prev) => !prev)}
              className="h-10 px-3 bg-white text-green-500 border border-green-500 flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2 md:rounded-l-none"
            >
              <FiMoreHorizontal />
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-lg dropdown"
              >
                <button
                  onClick={handleEditOrSave}
                  disabled={loading}
                  className="flex px-4 py-3 hover:bg-gray-100 md:hidden items-center w-full"
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
                      <FiEdit className="mr-2" />Edit
                    </>
                  )}
                </button>
                <button
                  onClick={handleCopyURL}
                  className="w-full px-4 py-3 hover:bg-gray-100 flex items-center"
                >
                  <FiCopy className="mr-2" />Copy URL
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-gray-100 flex items-center"
                >
                  <FiTrash className="mr-2" />Delete
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full h-80 p-5 border rounded-lg outline-none shadow-inner"
          placeholder="Enter your note here..."
        />
      ) : (
        <div className="float-up-animation">
         <div
            className="prose md space-y-4 mt-4"
            dangerouslySetInnerHTML={{ __html: marked(noteContent) }}
          />
          <p className="text-center my-4 opacity-50 select-none">This page is powered by Annoote.</p>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-5">Delete Note</h2>
            <p>Are you sure you want to delete this note?</p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg mr-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200"
              >
                {loading ? <FiLoader className="animate-spin mr-2" /> : "Delete"}
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}