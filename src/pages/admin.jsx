import { useState } from "react";
import "../pagestyles/admin.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { uploadData } from "aws-amplify/storage";
import '@aws-amplify/ui-react/styles.css';
import { MdEdit } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const handleDateFormatting = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();
  return `${year}-${formattedDay}-${formattedMonth}`;
};

function EditAnnouncement({ announcement, index, updateAnnouncement }) {
  const [editedAnnouncement, setEditedAnnouncement] = useState(announcement);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAnnouncement = { ...editedAnnouncement };

    if (typeof editedAnnouncement.Image === 'object') {
      const imageKey = await uploadImageAndGenerateURL(editedAnnouncement.Image, `public/announcements/images/${index}.png`);
      updatedAnnouncement.Image = imageKey;
    }

    if (typeof editedAnnouncement.Background === 'object') {
      const backgroundKey = await uploadImageAndGenerateURL(editedAnnouncement.Background, `public/announcements/backgrounds/${index}.png`);
      updatedAnnouncement.Background = backgroundKey;
    }

    updateAnnouncement(updatedAnnouncement, index);
  };

  const uploadImageAndGenerateURL = async (file, path) => {
    try {
      const result = await uploadData({
        path: path,
        data: file
      }).result;
      return `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/${path}`;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  return (
    <div className="blur-background">
      <div className='add-edit-announcement-container'>
        <span className="add-edit-header">
          <h3>Edit Announcement</h3>
          <button className="close-edit" onClick={() => updateAnnouncement(null)}><IoIosClose /></button>
        </span>
        <form className="edit-add-form" onSubmit={handleSubmit}>
          <input className="edit-add-form-title" type="text" id="title" name="title" value={editedAnnouncement.Title} onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Title: e.target.value })} />
          <textarea className="edit-add-form-description" id="description" name="description" value={editedAnnouncement.Description} onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Description: e.target.value })} />
          <label htmlFor="image">Image</label>
          <input className="edit-add-form-image" type="file" id="image" name="image" onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Image: e.target.files[0] })} />
          <label htmlFor="background">Background Image</label>
          <input className="edit-add-form-background" type="file" id="background" name="background" onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, Background: e.target.files[0] })} />
          <button className="edit-add-form-submit" type="submit">Edit Announcement</button>
        </form>
      </div>
    </div>
  );
}

function AddAnnouncement({ addAnnouncement, nextId }) {
  const [newAnnouncement, setNewAnnouncement] = useState({
    id: nextId,
    Date: handleDateFormatting(new Date()),
    Title: '',
    Description: '',
    Image: '',
    Background: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const announcementWithURLs = { ...newAnnouncement };

    if (announcementWithURLs.Image) {
      const imageKey = await uploadImageAndGenerateURL(announcementWithURLs.Image, `public/announcements/images/${announcementWithURLs.id}.png`);
      announcementWithURLs.Image = imageKey;
    }

    if (announcementWithURLs.Background) {
      const backgroundKey = await uploadImageAndGenerateURL(announcementWithURLs.Background, `public/announcements/backgrounds/${announcementWithURLs.id}.png`);
      announcementWithURLs.Background = backgroundKey;
    }

    addAnnouncement(announcementWithURLs);
  };

  const uploadImageAndGenerateURL = async (file, path) => {
    try {
      const result = await uploadData({
        path: path,
        data: file
      }).result;
      return `https://fgbtheatersstoragef2bb9-dev.s3.amazonaws.com/${path}`;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  return (
    <div className="blur-background">
      <div className='add-edit-announcement-container'>
        <span className="add-edit-header">
          <h3>Add Announcement</h3>
          <button className="close-edit" onClick={() => addAnnouncement(false)}><IoIosClose /></button>
        </span>
        <form onSubmit={handleSubmit}>
          <input className="edit-add-form-title" type="text" id="title" name="title" value={newAnnouncement.Title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Title: e.target.value })} />
          <textarea className="edit-add-form-description" id="description" name="description" value={newAnnouncement.Description} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Description: e.target.value })} />
          <input className="edit-add-form-image" type="file" id="image" name="image" onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Image: e.target.files[0] })} />
          <input className="edit-add-form-background" type="file" id="background" name="background" onChange={(e) => setNewAnnouncement({ ...newAnnouncement, Background: e.target.files[0] })} />
          <button type="submit" onClick={() => addAnnouncement(false)}>Add Announcement</button>
        </form>
      </div>
    </div>
  );
}

function Admin(props) {
  const { signOut, user, announcements: initialAnnouncements } = props;
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [addNewAnnouncement, setAddNewAnnouncement] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(null);

  const addAnnouncement = (newAnnouncement) => {
    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    uploadAnnouncements(updatedAnnouncements);
    setAddNewAnnouncement(false);
  };

  const updateAnnouncement = (updatedAnnouncement, index) => {
    const updatedAnnouncements = announcements.map((ann, i) =>
      i === index ? updatedAnnouncement : ann
    );
    setAnnouncements(updatedAnnouncements);
    uploadAnnouncements(updatedAnnouncements);
    setEditAnnouncement(null);
  };

  const convertToJSON = (announcements) => {
    const jsonAnnouncements = announcements.map((announcement) => {
      const { id, Date, Title, Description, Image, Background } = announcement;
      return { id, Date, Title, Description, Image, Background };
    });
    return JSON.stringify(jsonAnnouncements);
  };

  const uploadAnnouncements = async (announcements) => {
    try {
      await uploadData({
        path: 'public/announcements/announcements.json',
        data: convertToJSON(announcements)
      }).result;
      console.log("Uploaded announcements");
    } catch (error) {
      console.log('Error uploading announcements: ', error);
    }
  };

  return (
    <div className="page-container">
      <div className="admin-console">
        <span className="admin-console-header">
          <h2>Hello {user.username}</h2>
          <button className="sign-out-button" onClick={signOut}>Sign out</button>
        </span>
        <button className="add-announcement-button" onClick={() => setAddNewAnnouncement(!addNewAnnouncement)}>Add Announcement</button>
        {addNewAnnouncement && (
          <AddAnnouncement addAnnouncement={addAnnouncement} nextId={announcements.length} />
        )}
        {editAnnouncement !== null && (
          <EditAnnouncement
            announcement={announcements[editAnnouncement]}
            index={editAnnouncement}
            updateAnnouncement={updateAnnouncement}
          />
        )}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Image</th>
                <th scope="col">Background</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement, index) => (
                <tr key={index}>
                  <td>{handleDateFormatting(new Date(announcement.Date))}</td>
                  <td>{announcement.Title}</td>
                  <td>{announcement.Description}</td>
                  <td><img src={announcement.Image} alt={announcement.Title} /></td>
                  <td><img src={announcement.Background} alt={announcement.Title} /></td>
                  <td>
                    <button
                      onClick={() => setEditAnnouncement(index)}
                    >
                      <MdEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminWithAuth(props) {
  return (
    <Authenticator className="sign-in" hideSignUp={true}>
      {({ signOut, user }) => <Admin announcements={props.announcements} signOut={signOut} user={user} />}
    </Authenticator>
  );
}
