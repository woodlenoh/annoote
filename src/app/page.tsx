"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FiLoader } from "react-icons/fi";

export default function Home() {
  const [noteID, setNoteID] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleGoToNote = async () => {
    // バリデーション
    if (!noteID) {
      setErrorMessage("Please enter a Note ID.");
      return;
    }
    if (noteID.length >= 15) {
      setErrorMessage("Note ID must be 15 characters or less.");
      return;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(noteID)) {
      setErrorMessage("Note ID can only contain letters, numbers, hyphens, and underscores.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // エラーメッセージをクリア
    try {
      const noteRef = doc(db, "notes", noteID);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        setErrorMessage("This Note ID is already in use.");
        return;
      }

      // ノートが存在しなければ新しいノートを作成
      await setDoc(noteRef, { content: "", createdAt: new Date() });

      // ノートページにリダイレクト
      router.push(`/${noteID}`);
    } catch (error) {
      console.error("Error creating note:", error);
      setErrorMessage("Failed to create the note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-full md:max-w-md mx-4 md:mx-auto">
      <div className="mt-16 mb-8 flex flex-col items-center">
        <div className="flex items-center">
          <div className="rounded-full bg-green-500 h-5 w-5 mr-2.5" />
          <h1 className="text-5xl font-bold">Annote</h1>
          <div className="rounded-full bg-green-500 h-5 w-5 ml-2.5" />
        </div>
        <p className="mt-2">Share Your Notes Online with Ease</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <input
            placeholder="Enter Note ID"
            value={noteID}
            onChange={(e) => setNoteID(e.target.value)}
            className="w-full mr-4 px-4 py-2 border rounded-lg shadow outline-none focus:ring-2 focus:ring-primary duration-200 ring-offset-2"
          />
          <button
            onClick={handleGoToNote}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2"
          >
            {loading && (
              <FiLoader className="animate-spin mr-2" />
            )}
            Create
          </button>
        </div>
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        <div>
          <Image src="/notes.svg" alt="storyset.com" width={100} height={100} className="w-80" />
        </div>
      </div>
    </div>
  );
}