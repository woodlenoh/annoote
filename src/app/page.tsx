"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FiLoader } from "react-icons/fi";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [noteID, setNoteID] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleGoToNote = async () => {
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

    const lowerCaseNoteID = noteID.toLowerCase();

    setLoading(true);
    setErrorMessage("");
    try {
      const noteRef = doc(db, "notes", lowerCaseNoteID);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        setErrorMessage("This Note ID is already in use.");
        return;
      }

      await setDoc(noteRef, { content: "", createdAt: new Date() });

      router.push(`/${lowerCaseNoteID}`);
    } catch (error) {
      console.error("Error creating note:", error);
      setErrorMessage("Failed to create the note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="md:w-3/4 mx-4 md:mx-auto">
      <Header />
      <div className="mt-8 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center space-y-8">
          <h1 className="text-5xl font-bold">Share <span className="text-gradient">Your Notes</span> Online with Ease</h1>
          <p className="text-2xl">Easy note-sharing. Create, edit, and share notes via URL. Simple idea collaboration!</p>
          <div>
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
          </div>
        </div>
        <div>
          <Image src="/bear.svg" alt="bear" width={100} height={100} className="opacity-80 w-full select-none" draggable="false" />
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}