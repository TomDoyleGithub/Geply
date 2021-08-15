import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import React from 'react';
import Auth from '../utils/auth';

import { allMessages, getConversations, GET_ME } from '../utils/queries';
import { Link, Redirect } from 'react-router-dom';
import ThreeDotsWave from '../components/Tools/ThreeDotsWave';

function MainChat() {
    const { data } = useQuery(GET_ME);
    const yourID = data?.me?._id || {};

    const { data: dataB, loading } = useQuery(getConversations);
    const { data: messageData } = useQuery(allMessages);
    const messages = messageData?.allMessages;
    
    if (!Auth.loggedIn()){
        return <Redirect to='/'/>
        }
    return (
        <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        >
            <section className='page-container'>
                <section className='explore-container'>
                    <p className='username account-header explore-header'>Chat</p>
                    <div className='search-container'>
                        <input placeholder='Search' className='search-bar'/>
                    </div>
                    {loading ? (
                        <section className='profile-search-load-container'>
                            <ThreeDotsWave/>
                        </section>
                    ) : (
                        dataB?.getConversations?.map((conversation) => (
                            conversation?.members?.filter(member => member?._id !== yourID).map(filter => (
                                <Link to={`/message/${conversation._id}`} className='message-card' key={filter._id}>
                                <section className='image-container image-chat small-image-container'>
                                    {filter.propic === '#' ? (
                                        <p>{filter.username[0].toUpperCase()}</p>
                                    ) : (
                                        <img className='small-pic' alt='Profile Icon' src={filter.propic}/>
                                    )}
                                </section>
                                <section className='message-titles'>
                                    <p>{filter.username}</p>
                                    {/* Will have to shorten when getting data */}
                                    {messages?.filter(message => message?.conversationId === conversation._id)?.reverse()?.map((newMessage, i) => (
                                        i === 0 ? (
                                            <p key={newMessage?._id} className='light-text'>{newMessage.text.slice(0, 23)}..</p>
                                        ) : (
                                            <div key={newMessage?._id}></div>
                                        )
                                    ))}
                                </section>
                            </Link> 
                            ))
                            )
                        )
                    )}
                </section>
            </section>
        </motion.div>
    )}

export default MainChat
