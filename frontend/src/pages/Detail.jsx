import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

// Use env variable or fallback to your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://blog-website-cdji.onrender.com";

function Detail() {
  const { id } = useParams();
  const [blogs, setblogs] = useState({});
  
  useEffect(() => {
    const fetchblogs = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/blogs/single-blog/${id}`,
          {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
          }
        );
        setblogs(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load blog details");
      }
    };
    fetchblogs();
  }, [id]);

  return (
    <div>
      <div>
        {blogs && (
          <section className="container mx-auto p-4">
            <div className="text-blue-500 uppercase text-xs font-bold mb-4">
              {blogs?.category}
            </div>
            <h1 className="text-4xl font-bold mb-6">{blogs?.title}</h1>
            <div className="flex items-center mb-6">
              <img
                src={blogs?.adminPhoto}
                alt="author_avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <p className="text-lg font-semibold">{blogs?.adminName}</p>
            </div>

            <div className="flex flex-col md:flex-row">
              {blogs?.blogImage && (
                <img
                  src={blogs?.blogImage?.url}
                  alt="mainblogsImg"
                  className="md:w-1/2 w-full h-[500px] mb-6 rounded-lg shadow-lg cursor-pointer border"
                />
              )}
              <div className="md:w-1/2 w-full md:pl-6">
                <p className="text-lg mb-6">{blogs?.about}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Detail;
