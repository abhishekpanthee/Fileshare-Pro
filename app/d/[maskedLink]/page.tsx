"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams to access dynamic route parameters
import { Button } from "@/components/ui/button";
import { FileText, Download, Home, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface FileData {
  maskedLink: string;
  originalLink: string;
  fileDetails: {
    createTime: number;
    downloadPage: string;
    guestToken: string;
    id: string;
    md5: string;
    mimetype: string; // MIME type of the file
    modTime: number;
    name: string; // Name of the file
    parentFolder: string;
    parentFolderCode: string;
    servers: string[];
    size: number; // Size of the file in bytes
    type: string;
  };
}

export default function DownloadPage() {
  const params = useParams(); // Use useParams to access dynamic route parameters
  const maskedLink = params.maskedLink as string; // Extract maskedLink from params

  const [originalLink, setOriginalLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // New state for the thumbnail
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Construct the full URL from the maskedLink parameter
    const fullMaskedLink = `https://filesharepro.us.kg/${maskedLink}`;
    console.log("Constructed fullMaskedLink:", fullMaskedLink);
  
    // Fetch the JSON data from the URL
    fetch('https://raw.githubusercontent.com/codecrumbs404/databse/main/file.json')
      .then((response) => response.json())
      .then((data: FileData[]) => {
        console.log("Fetched data:", data);
  
        // Find the file data that matches the constructed full URL
        const fileData = data.find((item) => {
          const itemMaskedLink = item.maskedLink.endsWith('/') ? item.maskedLink.slice(0, -1) : item.maskedLink;
          const fullMaskedLinkClean = fullMaskedLink.endsWith('/') ? fullMaskedLink.slice(0, -1) : fullMaskedLink;
          return itemMaskedLink === fullMaskedLinkClean;
        });
  
        console.log("Found fileData:", fileData);
  
        if (fileData) {
          // Set the original link and other details
          setOriginalLink(fileData.originalLink);
          setFileName(fileData.fileDetails.name);
          setFileSize(fileData.fileDetails.size);
          setFileMimeType(fileData.fileDetails.mimetype);
  
          // Request the thumbnail image from Pixeldrain API
          const thumbnailId = fileData.fileDetails.id;
          const thumbnailApiUrl = `https://pixeldrain.com/api/file/${thumbnailId}/thumbnail?width=128&height=128`;

          // Fetch the thumbnail
          fetch(thumbnailApiUrl)
            .then((response) => {
              if (response.ok) {
                setThumbnailUrl(thumbnailApiUrl); // Set thumbnail URL if the request is successful
              } else {
                console.error("Failed to load thumbnail");
              }
            })
            .catch((error) => {
              console.error("Error fetching thumbnail:", error);
            });
  
        } else {
          setError('File not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch file data');
        setLoading(false);
      });
  }, [maskedLink]);

  const handleDownload = () => {
    if (originalLink) {
      // Directly download the file using the id in the URL
      const downloadUrl = `${originalLink}?id=${maskedLink}`;
      window.location.href = downloadUrl; // Initiate the download by setting the location
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <RotateCw className="h-12 w-12 text-blue-500" />
          </motion.div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-bold text-3xl sm:text-4xl text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            File Not Found
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                Return to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <motion.div
        className="text-center space-y-4 p-6 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-bold text-3xl sm:text-4xl text-gray-900">
          Download Your File
        </h1>

        {/* File Thumbnail */}
        {thumbnailUrl && (
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-32 h-32 object-cover rounded-md"
            />
          </motion.div>
        )}

        {/* File Details */}
        {fileName && fileSize && fileMimeType && (
          <motion.div
            className="text-left space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold">File Name:</span> {fileName}
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold">File Size:</span>{" "}
              {(fileSize / 1024).toFixed(2)} KB
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="font-semibold">ID:</span> {maskedLink}
            </p>
          </motion.div>
        )}

        {/* Download Button */}
        {originalLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download File
            </Button>
          </motion.div>
        )}

        {/* Blog Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/blog">
            <Button variant="outline" size="lg" className="mt-4">
              Read Blog <FileText className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
