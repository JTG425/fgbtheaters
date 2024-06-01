import "../pagestyles/tickets.css";
import "../pagestyles/home.css";
import React, { useState } from "react";
import { motion } from "framer-motion";

function Tickets() {
  const [confirmed, setConfirmed] = useState(false);

  const handleCheckbox = (e) => {
    setConfirmed(e.target.checked);
  };
  return (
    <div className="page-container">
      <motion.div className="tickets">
      <h2>Buy Tickets Online</h2>
      <div className="prices">
        <h3>Prices</h3>

      </div>
        <div className="tickets-terms">

        <h3>Print At Home</h3>
        <p>
          When you purchase your tickets online, a confirmation email will be
          sent to you, accompanied by a set of bar codes, and 12 numbers. These
          can be brought straight to the ticket-taker stationed in front of the
          theatre or the will call window.
        </p>

        <h3>Order & Pick-up Online Tickets</h3>
        <p>
          Please make sure to check the date and showtime of the movie you wish
          to buy tickets for. Tickets are valid only for the date and showtime
          purchased. You will need a credit card to purchase online tickets, and
          there is a non-refundable $1.00 service fee for each ticket.
        </p>
        <p>
          You will receive an email confirmation receipt with the purchase
          number and a set of bar codes. Some ISP's will block the confirmation
          email, but that does NOT mean that there was a problem with the
          transaction.
        </p>
        <p>
          <b>
            <i>
              *You need the confirmation email and/or credit card you used to
              purchase the tickets in order to pick them up at the theatre.*
            </i>
          </b>
        </p>
        <h3>Cancellations</h3>
        <p>
          You will need to present the same credit card at the theatre to
          process any refunds, cancellations or exchanges. Service charges are
          not refundable due to 3rd party fees.
        </p>
        <p>
          <span>
            <b>
              <i>
                Refunds can only be issued on or before the specific start time
                on the ticket purchased. Please contact the theatre prior to
                showtime if unable to attend (802-223-4778).
              </i>
            </b>
          </span>
        </p>
        </div>

        <motion.div className="terms">
          <motion.input
            type="checkbox"
            id="terms"
            name="terms"
            onChange={handleCheckbox}
          />
          <label htmlFor="terms">
            I have read and agree to the terms and conditions
          </label>
        </motion.div>
        <motion.div className="tickets-button">
          <a
            href="https://app.formovietickets.com/?id=fgbtheatres"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (confirmed === false) {
                e.preventDefault();
              }
            }}
          >
            <motion.button
              className="buy-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={confirmed === false}
            >
              Buy Tickets
            </motion.button>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Tickets;
