import React from 'react';
import Image from 'next/image';
import avatar from '../../public/globe.svg'; // Replace with your avatar path

const Card = () => {
  return (
    <div className="ticket-card">
      <div className="ticket-left">
        <p className="event-title">🎟️ Coding Conf</p>
        <p className="event-sub">Dec 21, 2025 | Austin, TX</p>

        <div className="user-info">
          <Image src={avatar} alt="avatar" width={40} height={40} className="user-avatar" />
          <div className="user-text">
            <h4>Jonatan Kristof</h4>
            <p>@jonatankristof</p>
          </div>
        </div>
      </div>

      <div className="ticket-right">
        <p className="ticket-code">001209</p>
      </div>
    </div>
  );
};

export default Card;
