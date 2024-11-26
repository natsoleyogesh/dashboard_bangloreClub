import { AddCircle, Download, Gavel, Group, ListAlt, LocalOffer, NotificationsActive, QuestionAnswer, School } from "@mui/icons-material";
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
    name: "Club HOD's",
    icon: <School />, // Changed to a school-related icon
    subLinks: [
      {
        name: "All HOD's",
        url: "/hods",
      },
      {
        name: "Add HOD",
        url: "/hod/add",
      },
    ],
  },
  {
    name: "Downloads",
    icon: <Download />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All Downloads",
        url: "/downloads",
      },
      {
        name: "Add Download",
        url: "/download/add",
      },
    ],
  },
  {
    name: "Notices",
    icon: <NotificationsActive />, // Changed to a notifications-related icon
    subLinks: [
      {
        name: "All Club Notice",
        url: "/notices",
      },
      {
        name: "Add Club Notice",
        url: "/notice/add",
      },
    ],
  },
  {
    name: "General Committee",
    icon: <Group />, // Changed to a notifications-related icon
    subLinks: [
      {
        name: "All General Committee Member",
        url: "/gcms",
      },
      {
        name: "Add Committee Member",
        url: "/gcm/add",
      },
    ],
  },
  {
    name: "Club Rules & ByeLaws",
    icon: <Gavel />, // Icon for rules and byelaws
    subLinks: [
      {
        name: "All Club Rules",
        url: "/rules",
      },
      {
        name: "All Club ByeLaws",
        url: "/byeLaws",
      },
      {
        name: "Add Club Rule & ByeLaw",
        url: "/ruleByeLaw/add",
      },
    ],
  },
  {
    name: "FAQs",
    icon: <QuestionAnswer />, // Icon for FAQs
    subLinks: [
      {
        name: "All FAQs",
        url: "/faqs",
      },
      {
        name: "Add Club FAQs",
        url: "/faq/add",
      },
    ],
  },
  {
    name: "Consideration Of Membership's",
    icon: <Download />, // Changed to a download-related icon
    subLinks: [
      {
        name: "All COM's",
        url: "/coms",
      },
      {
        name: "Add COM",
        url: "/com/add",
      },
    ],
  },
  // {
  //   name: "Rooms",
  //   icon: <MdBed />,
  //   subLinks: [
  //     {
  //       name: "All Rooms",
  //       url: "/rooms",
  //     },
  //     {
  //       name: "Add Room",
  //       url: "/room/add",
  //     },
  //   ],
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
