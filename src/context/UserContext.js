import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../components/services/AxiosInstance";
import { useLocation } from "react-router-dom";


const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [id, userId] = useState(null);
  const [usertoken, setUserToken] = useState("");
  const [data, setData] = useState();
  const [metaData, setmetaData] = useState();
  const [loading, setLoading] = useState(true); // 👈 Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (usertoken) return;
    if (token) {
      setUserToken(token);
    }
  }, [usertoken]);

  const fetchUser = async () => {
    setLoading(true); // 👈 Start loading
    try {
      const response = await axiosInstance.get("/v1/auth/profile");
      console.log("response in context is: ", response);
      setData(response?.data?.user);
      userId(response?.data?.user?._id);
      setUser(response?.data?.user);
      setmetaData(response?.data?.userMeta);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false); // 👈 Done loading
    }
  };

  const fetchUserfree = async () => {
    try {
      const response = await axiosInstance.get("/v1/auth/profile");
      setData(response?.data?.user);
      userId(response?.data?.user?._id);
      setUser(response?.data?.user);
      setmetaData(response?.data?.userMeta);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [usertoken]);

  const partname = useLocation();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const [seo, setSeo] = useState({});
  const [allSeoData, setAllSeoData] = useState([]);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch(
          "https://cms.sevenunique.com/apis/SEO/get-seo-content.php?website_id=5"
        );
        const json = await res.json();
        setAllSeoData(json?.data || []);
        console.log(json?.data,"json?.data")
      } catch (err) {
        console.error("SEO Fetch Error:", err);
      }
    };
    fetchSeo();
  }, [partname]);

  useEffect(() => {
    const normalizeUrl = (url) => url?.replace(/\/+$/, "").toLowerCase();
    const fullUrl = normalizeUrl(
      window.location.origin + window.location.pathname
    );
    // const fullUrl = "https://rummy-eight.vercel.app";

    const matched = allSeoData.find(
      (item) => normalizeUrl(item?.page_slug) === fullUrl
    );

    if (matched) setSeo(matched);
    else setSeo({});
  }, [allSeoData, partname]);

  useEffect(() => {
    scrollToTop();
  }, [partname]);




  return (
    <UserContext.Provider
      value={{ user, setUserToken, id, data, fetchUser,fetchUserfree, metaData, loading ,scrollToTop,seo}}
    >
      {children}
    </UserContext.Provider>
  );
};
