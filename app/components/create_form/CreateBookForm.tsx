'use client';

import { useActionState, useState } from "react";
import { createBook } from "@/lib/action/bookAction";
import { SubmitButton, BackButton } from "../Buttons";

// We need to know WHO is creating the book
interface CreateBookFormProps {
  currentUserId: string; 
}

export default function CreateBookForm({ currentUserId }: CreateBookFormProps) {
  const [state, formAction] = useActionState(createBook, null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        e.target.value = '';
        return;
      }
      // Validate file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedUrl(data.secure_url);
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-5">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900">Publish New Book</h1>
      </div>

      <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        
        {/* HIDDEN INPUT: This links the book to the logged-in user */}
        <input type="hidden" name="writerId" value={currentUserId} />

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Book Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div aria-live="polite">
            {state?.Error?.title && <p className="text-red-500 text-xs italic mt-1">{state.Error.title[0]}</p>}
          </div>
        </div>

        {/* Author (Display Name) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
            Author Name (Display)
          </label>
          <input
            id="author"
            name="author"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div aria-live="polite">
            {state?.Error?.author && <p className="text-red-500 text-xs italic mt-1">{state.Error.author[0]}</p>}
          </div>
        </div>

        {/* Genre Select */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            defaultValue=""
          >
            <option value="" disabled>Select a Genre</option>
            <option value="FICTION">Fiction</option>
            <option value="NON_FICTION">Non-Fiction</option>
            <option value="SCIFI">Sci-Fi</option>
            <option value="FANTASY">Fantasy</option>
            <option value="MYSTERY">Mystery</option>
            <option value="ROMANCE">Romance</option>
            <option value="HORROR">Horror</option>
            <option value="HISTORY">History</option>
          </select>
          <div aria-live="polite">
            {state?.Error?.genre && <p className="text-red-500 text-xs italic mt-1">{state.Error.genre[0]}</p>}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="synopsis">
            Synopsis
          </label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <div aria-live="polite">
            {state?.Error?.synopsis && <p className="text-red-500 text-xs italic mt-1">{state.Error.synopsis[0]}</p>}
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Book PDF
          </label>
          
          <div className="flex items-center gap-3 mb-3">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
            
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {uploadedUrl && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm font-medium mb-1">✓ PDF uploaded successfully!</p>
              <p className="text-xs text-gray-600 break-all">{uploadedUrl}</p>
            </div>
          )}

          {/* Hidden input to send the URL to the server */}
          <input type="hidden" name="documentUrl" value={uploadedUrl} />
          
          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 10MB. Only PDF files are accepted.
          </p>
        </div>

        {state?.message && (
            <p className="mb-4 text-sm text-red-500 text-center">{state.message}</p>
        )}

        <SubmitButton label="Publish Book" loadingText="Publishing..." />
      </form>
    </div>
  );
}