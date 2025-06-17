import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProfileDropDown } from "../core/Auth/ProfileDropDown";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { GiHamburgerMenu } from "react-icons/gi";

// const subLinks = [
//     {
//         title: "python",
//         link:"/catalog/python"
//     },
//     {
//         title: "web dev",
//         link:"/catalog/web-development"
//     },
// ];

export const NavBar = () => {
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [subLinks, setSubLinks] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        console.log(res);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  console.log("heeloo", subLinks);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="h-14 border-b-[1px] border-b-richblack-700 flex items-center">
      <div className="w-11/12 mx-auto sm:flex justify-between items-center hidden">
        <Link to="/">
          <img src={Logo} width={160} height={42} loading="lazy" alt="logo" />
        </Link>

        <div className="flex gap-x-6 text-richblack-25">
          {NavbarLinks.map((ele, index) => (
            <div key={index}>
              {ele.title === "Catalog" ? (
                <div className="relative flex items-center gap-2 group cursor-pointer">
                  <p>{ele.title}</p>
                  <IoIosArrowDropdownCircle />

                  <div
                    className="invisible w-[300px] absolute opacity-0 bg-richblack-5 rounded-md text-richblack-900 p-4 z-40 cursor-pointer
                                        transition-all duration-200 left-[50%] top-[50%] translate-x-[-50%] translate-y-[25%] group-hover:visible group-hover:opacity-100"
                  >
                    <div
                      className="absolute rotate-45 h-6 w-6 bg-richblack-5 top-0 -z-10
                                            left-[50%] translate-x-[80%] translate-y-[-45%]"
                    ></div>

                    {subLinks.length ? (
                      subLinks.map((subLink, index) => (
                        <Link
                          to={`/catalog/${subLink.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                        >
                          <p
                            className="hover:bg-richblack-600 w-[100%] text-center capitalize rounded-md
                                                        transition-all duration-200 py-2 hover:text-richblack-5 tracking-wide font-semibold text-[16px]"
                          >
                            {subLink.name}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={ele.path}>
                  <p
                    className={`${
                      matchRoute(ele.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {ele.title}
                  </p>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex relative gap-x-4 items-center ">
          {user && user.accountType !== "Instructor" && (
            <Link to="/dashboard/cart">
              <AiOutlineShoppingCart className="text-richblack-25 text-xl" />
              {totalItems > 0 && (
                <span className="absolute text-yellow-50 -top-1 right-[62px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border rounded-md text-richblack-100 border-richblack-700 bg-richblack-800 px-[12px] py-[8px]">
                Login
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signUp">
              <button className="border rounded-md text-richblack-100 border-richblack-700 bg-richblack-800 px-[12px] py-[8px]">
                SignUp
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>

      <div className="w-11/12 mx-auto flex justify-between items-center sm:hidden">
        <Link to="/">
          <img src={Logo} width={130} height={42} loading="lazy" alt="logo" />
        </Link>

        <div className="flex gap-2 mr-1">
        {token !== null && <ProfileDropDown />}
          <button className="relative" onClick={() => setOpen(!open)}>
            <GiHamburgerMenu className="text-richblack-100 text-lg mr-3" />
            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[120%] z-[1000] p-2 rounded-md right-2 border-[1px] border-richblack-700 bg-richblack-800"
              >
                <div className="flex gap-x-6 text-richblack-25 lg:flex-row flex-col">
                  {NavbarLinks.map((ele, index) => (
                    <div key={index}>
                      {ele.title === "Catalog" ? (
                        <div className="relative flex items-center gap-2 group cursor-pointer"
                        onClick={()=>setOpen(!open)}>
                          <p>{ele.title}</p>
                          <IoIosArrowDropdownCircle />

                          <div
                            className="invisible w-[300px] absolute opacity-0 bg-richblack-5 rounded-md text-richblack-900 p-4 z-40 cursor-pointer
                                        transition-all duration-200 left-[50%] top-[50%] translate-x-[-50%] translate-y-[25%] group-hover:visible group-hover:opacity-100"
                          >
                            <div
                              className="absolute rotate-45 h-6 w-6 bg-richblack-5 top-0 -z-10
                                            left-[50%] translate-x-[80%] translate-y-[-45%]"
                            ></div>

                            {subLinks.length ? (
                              subLinks.map((subLink, index) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                >
                                  <p
                                    className="hover:bg-richblack-600 w-[100%] text-center capitalize rounded-md
                                                        transition-all duration-200 py-2 hover:text-richblack-5 tracking-wide font-semibold text-[16px]"
                                  >
                                    {subLink.name}
                                  </p>
                                </Link>
                              ))
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link to={ele.path}>
                          <p
                            className={`${
                              matchRoute(ele.path)
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}

                            onClick={()=>setOpen(!open)}
                          >
                            {ele.title}
                          </p>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                {token === null && (
                  <Link to="/login">
                    <button className="lg:border lg:rounded-md lg:text-richblack-100 lg:border-richblack-700 lg:bg-richblack-800 lg:px-[12px] lg:py-[8px] text-richblack-5">
                      Login
                    </button>
                  </Link>
                )}
                {token === null && (
                  <Link to="/signUp">
                    <button className="lg:border lg:rounded-md lg:text-richblack-100 lg:border-richblack-700 lg:bg-richblack-800 lg:px-[12px] lg:py-[8px] text-richblack-5">
                      SignUp
                    </button>
                  </Link>
                )}
              </div>
            )}
          </button>
          
        </div>
      </div>
    </div>
  );
};
