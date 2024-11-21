import { LocalOffer } from "@mui/icons-material";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaHandshake, FaShare } from "react-icons/fa";
import {
  FiHome,
  FiLayers,
  FiMail,
  FiMessageCircle,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { MdEmojiEvents, MdBed, MdCategory } from "react-icons/md";

export const links = [
  {
    name: "Dashboard",
    icon: <FiHome />,
    url: "/",
  },
  {
    name: "Members",
    icon: <FiUsers />,
    subLinks: [
      {
        name: "All Members",
        url: "/customers",
      },
      {
        name: "Add Member",
        url: "/member/add",
      },
    ],
  },
  // {
  //   name: "Members",
  //   icon: <FiUsers />,
  //   url: "/customers",
  // },
  // {
  //   name: "Add Member",
  //   icon: <FiUser />,
  //   url: "/member/add",
  // },
  {
    name: "Events",
    icon: <MdEmojiEvents />,
    subLinks: [
      {
        name: "All Events",
        url: "/events",
      },
      {
        name: "Add Event",
        url: "/events/add",
      },
    ],
  },
  {
    name: "Room Categories",
    icon: <MdCategory />,
    subLinks: [
      {
        name: "All Categories",
        url: "/categories",
      },
      {
        name: "Add Category",
        url: "/category/add",
      },
    ],
  },
  {
    name: "Offers",
    icon: <LocalOffer />,
    subLinks: [
      {
        name: "All Offers",
        url: "/offers",
      },
      {
        name: "Add Offer",
        url: "/offer/add",
      },
    ],
  },
  {
    name: "Rooms",
    icon: <MdBed />,
    subLinks: [
      {
        name: "All Rooms",
        url: "/rooms",
      },
      {
        name: "Add Room",
        url: "/room/add",
      },
    ],
  },
  // {
  //   name: "Events",
  //   icon: <MdEmojiEvents />,
  //   url: "/events",
  // },
  // {
  //   name: "Add Events",
  //   icon: <MdEmojiEvents />,
  //   url: "/events/add",
  // },
  // {
  //   name: "Sales",
  //   icon: <BsCurrencyDollar />,
  //   subLinks: [
  //     {
  //       name: "Sales Analytics",
  //       url: "/sales/analysis",
  //     },
  //     {
  //       name: "Product Sales",
  //       url: "/sales",
  //     },
  //   ],
  // },
  // {
  //   name: "Orders",
  //   icon: <FiShoppingCart />,
  //   subLinks: [
  //     {
  //       name: "All Orders",
  //       url: "/orders",
  //     },
  //     {
  //       name: "Order Template",
  //       url: "/orders/template",
  //     },
  //   ],
  // },
  // {
  //   name: "Suppliers",
  //   icon: <FaShare />,
  //   url: "/suppliers",
  // },
  // {
  //   name: "Transactions",
  //   icon: <FaHandshake />,
  //   url: "/transactions",
  // },
  // {
  //   name: "Brands",
  //   icon: <FiLayers />,
  //   url: "/brands",
  // },
  // {
  //   name: "Reviews",
  //   icon: <FiMessageCircle />,
  //   url: "/reviews",
  // },
  {
    name: "Settings",
    icon: <FiSettings />,
    url: "/settings",
  },
  // {
  //   name: "Inbox",
  //   icon: <FiMail />,
  //   url: "/inbox",
  // },
];
