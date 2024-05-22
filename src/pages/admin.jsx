import { useEffect, useState } from "react";
import "../pagestyles/admin.css";
import { motion } from "framer-motion";
import AddSlideShow from "../admincomponents/addSlideshow";
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { downloadData, uploadData, getUrl } from 'aws-amplify/storage';
import { MdEdit } from "react-icons/md";
import { IoCloseCircleOutline, IoExit } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

const handleDateFormating = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${year}-${formattedDay}-${formattedMonth}`;
};

function Admin({ signOut, user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addingNewAnnouncement, setAddingNewAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    date: '',
    title: '',
    description: '',
    image: null,
  });
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateFailed, setShowUpdateFailed] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      let announcementsXML = '';
      try {
        const getAnnouncementsXML = await downloadData({
          path: 'public/announcements/announcements.xml',
        }).result;
        announcementsXML = await getAnnouncementsXML.body.text();
        parseAnnouncementsXML(announcementsXML);
      } catch (error) {
        console.log('Error : ', error);
      }
    };

    const parseAnnouncementsXML = async (xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const announcementNodes = xmlDoc.getElementsByTagName('announcement');

      const parsedAnnouncements = [];
      for (let i = 0; i < announcementNodes.length; i++) {
        const announcementNode = announcementNodes[i];
        const active = announcementNode.getElementsByTagName('active')[0].textContent;
        const id = announcementNode.getElementsByTagName('id')[0].textContent;
        const date = announcementNode.getElementsByTagName('data')[0].textContent;
        const title = announcementNode.getElementsByTagName('title')[0].textContent;
        const description = announcementNode.getElementsByTagName('description')[0].textContent;
        const image = await fetchImage(i);
        parsedAnnouncements.push({ id, active, date, title, description, image });
      }
      setAnnouncements(parsedAnnouncements);
    }

    const fetchImage = async (id) => {
      try {
        const url = await getUrl({
          path: `public/announcements/images/${id}.jpg`
        });
        return url.url.href;
      } catch (error) {
        console.log('Error fetching image:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleEditClick = (announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (currentAnnouncement.image instanceof File) {
      currentAnnouncement.image = await uploadImage(currentAnnouncement.image, currentAnnouncement.id);
    }
    const updatedAnnouncements = announcements.map(ann =>
      ann.id === currentAnnouncement.id ? currentAnnouncement : ann
    );
    setAnnouncements(updatedAnnouncements);
    setCurrentAnnouncement(null);
    handleUpdateXMLandPushToS3(updatedAnnouncements);
  };

  const handleToggle = (announcement) => {
    // Toggle announcement active status
    announcement.active = announcement.active === "True" ? "False" : "True";
    const updatedAnnouncements = [...announcements];
    const index = updatedAnnouncements.findIndex(a => a.id === announcement.id);
    updatedAnnouncements[index] = announcement;
    setAnnouncements(updatedAnnouncements);
    handleUpdateXMLandPushToS3(updatedAnnouncements);
  };

  const handleAddNewAnnouncement = async (e) => {
    e.preventDefault();
    const id = (announcements.length).toString();
    const date = handleDateFormating(new Date());
    const { title, description } = newAnnouncement;
    const active = "True";
    const image = await uploadImage(newAnnouncement.image, id);
    const newAnn = { id, date, title, description, image, active };
    const updatedAnnouncements = [...announcements, newAnn];
    setAnnouncements(updatedAnnouncements);
    setAddingNewAnnouncement(false);
    setNewAnnouncement({ date: '', title: '', description: '', image: null });

    handleUpdateXMLandPushToS3(updatedAnnouncements);
  };

  const uploadImage = async (file, id) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await uploadData({
            path: `public/announcements/images/${id}.jpg`,
            data: reader.result,
            contentType: 'image/jpeg',
          });
          const url = await getUrl({
            path: `public/announcements/images/${id}.jpg`
          });
          resolve(url.url.href);
        } catch (error) {
          console.log('Error uploading image:', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.log('Error reading file:', error);
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpdateXMLandPushToS3 = async (updated) => {
    // Update XML file with new announcement data and push to S3
    const convertToXML = (announcements) => {
      const xmlHeader = '<?xml version="1.0"?>';
      const rootStart = '<announcements>';
      const rootEnd = '</announcements>';

      const announcementNodes = announcements.map((announcement, index) => `
        <announcement>
          <active>${announcement.active}</active>
          <id>${index}</id>
          <data>${announcement.date}</data>
          <title>${announcement.title}</title>
          <description>${announcement.description}</description>
          <image>${index}</image>
        </announcement>
      `).join('');

      return `${xmlHeader}${rootStart}${announcementNodes}${rootEnd}`;
    };

    const xmlContent = convertToXML(updated);

    try {
      const result = await uploadData({
        path: 'public/announcements/announcements.xml',
        data: xmlContent,
        contentType: 'application/xml',
      }).result;
      setShowUpdateSuccess(true);
    } catch (error) {
      console.log('Error updating XML in S3:', error);
      alert('Failed to update announcements.');
    }
  };

  const handleDelete = (announcement) => {
    // Delete announcement
    const updatedAnnouncements = announcements.filter(a => a.id !== announcement.id);
    setAnnouncements(updatedAnnouncements);
    handleUpdateXMLandPushToS3(updatedAnnouncements);
  };

  const activeButtonVariants = {
    true: {
      backgroundColor: "#00ff00",
      color: "#000",
    },
    false: {
      backgroundColor: "#ff0000",
      color: "#fff",
    }
  };

  const uploadVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      }
    }
  };

  useEffect(() => {
    if (showUpdateSuccess) {
      setTimeout(() => {
        setShowUpdateSuccess(false);
      }, 3000);
    }
  }, [showUpdateSuccess]);

  return (
    <div className="page-container">
      <div className="admin-console">
        <motion.div
          className="update"
          initial="hidden"
          animate={showUpdateSuccess ? "visible" : "hidden"}
          variants={uploadVariants}
        >
          <FaCheckCircle color="green" className="check-icon" />
          Announcements Updated
        </motion.div>

        <motion.div
          className="update"
          initial="hidden"
          animate={showUpdateFailed ? "visible" : "hidden"}
          variants={uploadVariants}
        >
          <IoCloseCircleOutline color="red" className="check-icon" />
          Announcements Failed To Update
        </motion.div>

        <span className="admin-console-header">
          <h2>Hello {user.username}</h2>
          <button className="sign-out-button" onClick={signOut}>Sign out</button>
        </span>
        <h2>Announcements</h2>
        <span className="announcement-legend">
          <motion.button
            className="add-announcement-button"
            onClick={() => setAddingNewAnnouncement(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >Add New Announcement</motion.button>
        </span>
        {addingNewAnnouncement && (
          <div className="blurred-background">
            <div className="edit-announcement-container">
              <h3>Add New Announcement</h3>
              <form onSubmit={handleAddNewAnnouncement}>
                <span className="edit-add-header">
                  <label>
                    <input
                      placeholder="Title"
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    />
                  </label>
                </span>
                <label>
                  <textarea
                    placeholder="Description"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  ></textarea>
                </label>
                <label>
                  <input
                    type="file"
                    accept=".jpg"
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, image: e.target.files[0] })}
                  />
                </label>
                <div className="edit-add-buttons">
                  <Button type="submit">Submit</Button>
                  <Button type="button" onClick={() => setAddingNewAnnouncement(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="announcement-table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td>{announcement.date}</td>
                  <td>{announcement.title}</td>
                  <td>{announcement.description}</td>
                  <td>
                    <img className="table-image" src={announcement.image} alt="announcement" />
                  </td>
                  <td>
                    <motion.button
                      className="active-button"
                      onClick={() => handleToggle(announcement)}
                      variants={activeButtonVariants}
                      animate={announcement.active === "True" ? "true" : "false"}
                    >
                      {announcement.active}
                    </motion.button>
                  </td>
                  <td>
                    <span className="action-buttons">
                      <button onClick={() => handleEditClick(announcement)}>
                        <MdEdit className="edit-button" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(announcement)}>
                        <IoCloseCircleOutline className="delete-button" />
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <div className="blurred-background">
            <div className="edit-announcement-container">
              <h3>Edit Announcement</h3>
              <form onSubmit={handleSaveEdit}>
                <span className="edit-add-header">
                  <label>
                    <input
                      type="text"
                      value={currentAnnouncement.title}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                    />
                  </label>
                </span>
                <label>
                  <textarea
                    value={currentAnnouncement.description}
                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, description: e.target.value })}
                  ></textarea>
                </label>
                <label>
                  <input
                    accept=".jpg"
                    type="file"
                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, image: e.target.files[0] })}
                  />
                </label>
                <div className="edit-add-buttons">
                  <Button type="submit">Submit</Button>
                  <Button type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2>Slideshow Content</h2>
        <AddSlideShow />
      </div>
    </div>
  );
}

export default function AdminWithAuth() {
  return (
    <Authenticator className="sign-in" hideSignUp={true}>
      {({ signOut, user }) => <Admin signOut={signOut} user={user} />}
    </Authenticator>
  );
}
