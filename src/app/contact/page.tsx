"use client"
import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FiLoader } from "react-icons/fi";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");

        try {
            await addDoc(collection(db, "contacts"), {
                ...formData,
                createdAt: new Date(),
            });
            setSuccessMessage("Thank you! Your message has been submitted.");
            setFormData({ name: "", email: "", subject: "" });
        } catch (error) {
            console.error("Error submitting form:", error);
            setSuccessMessage("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-full md:max-w-md mx-4 md:mx-auto">
            <div className="mt-16 mb-8">
                <h1 className="text-4xl font-bold">Annoote Contact Form</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label htmlFor="name" className="mb-2">Your Name</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-lg shadow outline-none focus:ring-2 focus:ring-primary duration-200 ring-offset-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="email" className="mb-2">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="px-4 py-2 border rounded-lg shadow outline-none focus:ring-2 focus:ring-primary duration-200 ring-offset-2"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="subject" className="mb-2">Subject</label>
                    <textarea
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-40 px-4 py-2 border rounded-lg shadow outline-none focus:ring-2 focus:ring-primary duration-200 ring-offset-2"
                        required
                    />
                </div>
                <div className="flex">
                    <div className="ml-auto">
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow outline-none focus-visible:ring-2 focus-visible:ring-primary duration-200 ring-offset-2"
                            disabled={loading}
                        >
                            {loading && (
                                <FiLoader className="animate-spin mr-2" />
                            )}
                            Submit
                        </button>
                    </div>
                </div>
                {successMessage && (
                    <p className="mt-8 text-center text-green-600">{successMessage}</p>
                )}
            </form>
        </div>
    );
}