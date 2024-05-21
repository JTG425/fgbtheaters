import { useEffect, useState } from "react";
import "../pagestyles/admin.css";
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { downloadData } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { MdEdit } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline, IoExit } from "react-icons/io5";

function Admin({ signOut, user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addingNewAnnouncement, setAddingNewAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    date: '',
    title: '',
    description: '',
    image: '',
  });
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

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

    const parseAnnouncementsXML = (xml) => {
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
        const image = announcementNode.getElementsByTagName('image')[0].textContent;
        parsedAnnouncements.push({ id, active, date, title, description, image });
      }

      setAnnouncements(parsedAnnouncements);
    }

    fetchAnnouncements();
  }, []);

  const handleEditClick = (announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    const updatedAnnouncements = announcements.map(ann =>
      ann.id === currentAnnouncement.id ? currentAnnouncement : ann
    );
    setAnnouncements(updatedAnnouncements);
    console.log(updatedAnnouncements);
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

  const handleAddNewAnnouncement = (e) => {
    e.preventDefault();
    const id = (announcements.length + 1).toString();
    const { date, title, description, image } = newAnnouncement;
    const active = "True";
    const newAnn = { id, date, title, description, image, active };
    const updatedAnnouncements = [...announcements, newAnn];
    setAnnouncements(updatedAnnouncements);
    setAddingNewAnnouncement(false);
    setNewAnnouncement({ date: '', title: '', description: '', image: '' });
    console.log('updatedAnnouncements', updatedAnnouncements);
    handleUpdateXMLandPushToS3(updatedAnnouncements);
  };

  const handleUpdateXMLandPushToS3 = async (updated) => {
    // Update XML file with new announcement data and push to S3
    // 1. Convert announcements back to XML file
    // -> Should update existing announcements IDs to match where they
    //    the index they occur in the array
    // -> Should add new announcements to the end of the XML file
    // 2. Push to S3, overwrite the existing file
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
          <image>${announcement.image}</image>
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
      }).result;;
      alert('Announcements updated successfully.');
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
  }


  return (
    <div className="page-container">
      <div className="admin-console">
        <span className="admin-console-header">
          <Heading level={1}>Hello {user.username}</Heading>
          <Button onClick={signOut}>Sign out</Button>
        </span>
        <h2>Current Announcements</h2>
        <span className="announcement-legend">
          <Button className="add-announcement-button" onClick={() => setAddingNewAnnouncement(true)}>Add New Announcement</Button>
        </span>
        {addingNewAnnouncement && (
          <div className="edit-announcement-container">
            <h3>Add New Announcement</h3>
            <form onSubmit={handleAddNewAnnouncement}>
              <span className="edit-add-header">
                <label>
                  <input
                    type="date"
                    value={newAnnouncement.date}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                  />
                </label>
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
                  placeholder="Image URL (Temp)"
                  type="text"
                  value={newAnnouncement.image}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, image: e.target.value })}
                />
              </label>
              <div className="edit-add-buttons">
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => setAddingNewAnnouncement(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}
        {/* Table of Announcements with Buttons to activate/deactivate, edit, add new, and delete announcements */}
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
                  <td>{announcement.image}</td>
                  <td>
                    <Button onClick={() => handleToggle(announcement)}>{announcement.active}</Button>
                  </td>
                  <td>
                    <span className="action-buttons">
                      <Button onClick={() => handleEditClick(announcement)}>
                        <MdEdit className="edit-button" />
                      </Button>
                      <Button onClick={() => handleDelete(announcement)}>
                        <IoCloseCircleOutline className="delete-button" />
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <div className="edit-announcement-container">
            <h3>Edit Announcement {currentAnnouncement.id}</h3>
            <form onSubmit={handleSaveEdit}>
              <span className="edit-add-header">
                <label>
                  <input type="date" value={currentAnnouncement.date} onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, date: e.target.value })} />
                </label>
                <label>
                  <input type="text" value={currentAnnouncement.title} onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })} />
                </label>
              </span>
              <label>
                <textarea value={currentAnnouncement.description} onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, description: e.target.value })}></textarea>
              </label>
              <label>
                <input type="text" value={currentAnnouncement.image} onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, image: e.target.value })} />
              </label>
              <div className="edit-add-buttons">
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}
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
