import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../lib/axios';
import { setMailContent } from '../store/mailStore';
import toast from 'react-hot-toast';
import { setCredentials } from '../store/mailpass';
import { Trash2,Loader2 } from 'lucide-react'


const HomePage = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedBody, setSelectedBody] = useState(null);
  const [selectFile, setSelectFile] = useState(null);
  const [senderEmailId, setSenderEmailId] = useState('');
  const [isBodyUploading, setIsBodyUploading] = useState(false);
  const [isTitleUploading, setIsTitleUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { credentials } = useSelector((state) => state.credentials)

  const [userCredentials, setUserCredentials] = useState({
    officialEmail: '',
    officialPassword: ''
  })
  // console.log('Credentials:', credentials);

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { content } = useSelector((state) => state.mail)
  // console.log('user detailsss:', user);

  const handleSendEmail = (e) => {
    e.preventDefault();
    // console.log('Selected Title:', selectedTitle, 'Selected Body:', selectedBody);
    if (selectedBody == null || selectedTitle == null) {
      toast.error('Body and Title are Mandatory');
      return;
    }
    const title = content.title[selectedTitle] || '';
    const body = content.body[selectedBody] || '';
    let file;
    if(selectFile !== null) {
      file = content.file[selectFile]
    }
    sendEmail(title, body,file);
    // setNewTitle('');
    // setNewBody('');
    // setSelectedTitle(null);
    // setSelectedBody(null);
    // setSenderEmailId('');
  }

  const sendEmail = async (title, body,file) => {
    setIsSending(true);
    try {
      if (!credentials) {
        toast.error('Please save your credentials first');
        return;
      }
      if (!senderEmailId) {
        toast.error('Please enter HR email');
        return;
      }
      const resp = await axiosInstance.post('/compose', {
        senderEmailId: credentials.officialEmail,
        senderPassword: credentials.officialPassword,
        to: senderEmailId,
        title: title,
        body: body,
        file : file,
        userName: user.name,
        userEmail: credentials.officialEmail,
      })
      // console.log('Email sent response:', resp.data);
      if (resp.data.message === 'Mail sent successfully') {
        toast.success('Email sent successfully');
      }
    } catch (error) {
      const resp = error.response?.data?.message || 'Failed to send email';
      // console.error('Error sending email:', resp.includes('Invalid login'));
      if (resp === 'No recipients defined') {
        toast.error('Please enter a valid HR email');
        return;
      }
      if (resp.includes('Invalid login')) {
        toast.error('Please check your official credentials');
        return;
      }
      toast.error(resp);
    }

    finally {
      setIsSending(false)
    }
  }

  const updateContent = async (e) => {
    e.preventDefault();
    if (!newTitle && !newBody) {
      toast.error('Please add a title or body');
      return;
    }
    setIsUpdating(true);
    if (!credentials) {
      toast.error('Please save your credentials first');
      setIsUpdating(false);
      return;
    }
    try {
      const resp = await axiosInstance.put('/update', {
        sender: user._id,
        title: newTitle,
        body: newBody,
        userName: user.name,
        userEmail: credentials.officialEmail,
      });
      // console.log('Update response:', resp.data);
      dispatch(setMailContent(resp.data.mailContents));
      toast.success('Content updated successfully');
      setNewTitle('');
      setNewBody('');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');

    }
    finally {
      setIsUpdating(false);
    }
  }

  const deleteContent = async (deletingData) => {
    if (!deletingData.title && !deletingData.body) {
      toast.error('Please add a title or body to delete');
      return;
    }
    try {
      const resp = await axiosInstance.post('/delete', {
        sender: user._id,
        title: deletingData.title,
        body: deletingData.body,
      })
      console.log('Delete response:', resp.data);
      dispatch(setMailContent(resp.data.updatedMail));
      toast.success('Content deleted successfully');
      setNewTitle('');
      setNewBody('');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete content');
    }
  }

  const handeleDelete = (e, index,f) => {
    e.preventDefault()
    const deletingData = {
      sender: user._id,
      title: f? content.title[index] : null,
      body: f? null : content.body[index],
    }
    deleteContent(deletingData);
    console.log('Deleting data:', deletingData);

  }

  const saveCredentials = (e) => {
    e.preventDefault();
    if (!userCredentials.officialEmail || !userCredentials.officialPassword) {
      toast.error('Email and Password are mandatory');
      return;
    }
    dispatch(setCredentials(userCredentials));
    // console.log('Saving credentials:', credentials);

    toast.success('Credentials saved successfully');
  }

  function handelResumeChange(e){
    e.preventDefault();
    const file = e.target.files[0]
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if( file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    setSelectedFile(file);
    console.log('Selected file:', file);
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    // console.log('Uploading file:', selectedFile);
    if(!selectedFile){
      toast.error('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sender', user._id);
    setIsFileUploading(true);
    try {
      const resp = await axiosInstance.post('/uploadFile',formData)
      dispatch(setMailContent(resp.data.mailContents));
      console.log('File upload response:', resp.data);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
    finally {
      setIsFileUploading(false);
      setSelectedFile(null);
    }
  }
  useEffect(() => {
    const fetchMailContents = async () => {
      try {
        const resp = await axiosInstance.post('/mailContents', { sender: user._id });
        dispatch(setMailContent(resp.data.mailContents));
        console.log("mail content",resp.data.mailContents);
        
      } catch (error) {
        toast.error('Failed to fetch mail contents');
      }
    }
    fetchMailContents()
  }, [user,isFileUploading,isUpdating])
  


  return (
    <div className="min-h-screen  px-6 py-10 flex flex-col gap-3 bg-[#0b0f1a] text-white">
      <div className='w-[100%] h-[100%] fixed top-0 left-0 z-50 bg-black/50 flex justify-center items-center' style={{ display: isSending ? 'flex' : 'none' }}>
      <Loader2 className='animate-spin text-white w-10 h-10' />
      </div>
      <div className="w-full mx-auto space-y-8  gap-4">
        {/* Email and Password */}
        <h2 className="text-3xl font-semibold">Your Email Credentials</h2>
        <form className="  flex w-full justify-between mt-3 gap-3 flex-row">
          <input
            type="email"
            name="officialEmail"
            placeholder="Official Gmail"
            value={userCredentials.officialEmail}
            onChange={(e) => setUserCredentials({ ...userCredentials, officialEmail: e.target.value })}
            required
            className=" px-4 py-2 bg-[#1a1e2c] border border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="officialPassword"
            placeholder="Gmail App Password"
            value={userCredentials.officialPassword}
            onChange={(e) => setUserCredentials({ ...userCredentials, officialPassword: e.target.value })}
            required
            className=" px-4 py-2 bg-[#1a1e2c] border border-gray-600 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveCredentials}
            type="submit"
            className=" bg-gradient-to-r from-blue-600 to-purple-700 py-2 rounded-md w-full hover:from-blue-700 hover:to-purple-800"
          >
            {
              credentials ? 'Update Credentials' : 'Save Credentials'
            }
          </button>
        </form>
        {/* HR Email */}
        <div className="space-y-3 " >
          <h2 className="text-2xl font-semibold">Send To HR</h2>
          <input
            type="email"
            name="hrEmail"
            value={senderEmailId}
            onChange={(e) => setSenderEmailId(e.target.value)}
            disabled={!credentials}
            placeholder="HR Email"
            className="w-full px-4 py-2 bg-[#1a1e2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Title Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-medium">Select a Title</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add new title"
              className="flex-1 px-3 py-2 rounded-md bg-[#1a1e2c] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={updateContent}
              type="button"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              +
            </button>
          </div>
          <div className="flex scrollbar flex-row  overflow-x-scroll max-h-[300px]">
            {content?.title.map((title, index) => (
              <button
                cursor={credentials ? 'pointer' : 'not-allowed'}
                disabled={!credentials}
                key={index}
                type="button"
                onClick={() => {
                  setSelectedTitle(index)
                }}
                className={`w-full m-2 gap-4  flex flex-row justify-between items-center px-4 py-2 rounded-md border min-w-fit text-left transition   ${selectedTitle === index
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-[#1a1e2c] border-gray-600 hover:bg-blue-500/20'
                  }`}
              >
                {title}
                <Trash2 onClick={(e)=>{handeleDelete(e,index,1)}} className=' cursor-pointer'/>
              </button>
            ))}
          </div>
        </div>
        {/* Body Selection */}
        <div className="space-y-3 ">
          <h3 className="text-xl font-medium">Select a Message Body</h3>
          <div className="flex  flex-row gap-3  scrollbar overflow-x-scroll overflow-y-hidden" >
            {content?.body.map((body, index) => (
              <div className='relative' key={index}>
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedBody(index)
                  }}
                  className={`px-4 h-full  m-2 min-w-[400px] py-3 rounded-md border text-left text-sm transition flex ${selectedBody === index
                    ? 'bg-purple-600 border-purple-400'
                    : 'bg-[#1a1e2c] border-gray-600 hover:bg-purple-500/20'
                    }`}
                >
                  {body}
                </button>
                <div className=' absolute top-2 right-2 m-2'>
                  <Trash2 onClick={(e)=>{handeleDelete(e,index,0)}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              type="textarea"
              height={100}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Add new message body"
              className="flex-1 px-3 py-2 rounded-md bg-[#1a1e2c] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={updateContent}
              type="button"
              className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
            >
              +
            </button>
          </div>
        </div>
        <div className="space-y-3 ">
          <h3 className="text-xl font-medium">Select a File</h3>
          <div className="flex  flex-row gap-3  scrollbar overflow-x-scroll overflow-y-hidden">
            {content?.file.map((file, index) => (
              <button
                key={index}
                type="button"
                onClick={()=>{setSelectFile(index)}}
                className={`w-full m-2 gap-4  flex flex-row justify-between items-center px-4 py-2 rounded-md border min-w-fit text-left transition   ${selectFile === index
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-[#1a1e2c] border-gray-600 hover:bg-blue-500/20'
                  }`}
              >
                {file.name}
                <Trash2 onClick={(e)=>{handeleDelete(e,index,1)}} className=' cursor-pointer'/>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              height={100}
              accept=".pdf,.doc,.docx,.txt"
              onChange={handelResumeChange}
              placeholder="Add new message body"
              className="flex-1 px-3 py-2 rounded-md bg-[#1a1e2c] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleFileUpload}
              className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
            >
              {
                isFileUploading ? <Loader2 className='animate-spin' /> : '+'
              }
            </button>
          </div>
        </div>
        
      </div>
      <button
        onClick={handleSendEmail}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-700 py-2 rounded-md hover:from-blue-700 hover:to-purple-800"
      >
        {
          isSending ? 'Sending...' : 'Send Email'
        }
      </button>
    </div>
  );
};

export default HomePage;
