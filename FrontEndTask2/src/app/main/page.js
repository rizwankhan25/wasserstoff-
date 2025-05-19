"use client";
import React from "react";
import Title from "../../components/Title";
import BrandTitle from "@/components/BrandTitle";
import Heading from "@/components/Heading";
import Card from "@/components/Card";

export default function HomePage() {
  return (
    <div className="page-background text-white">
      <div className="container">
        <div className="row  d-flex justify-content-center pb-2">
          <div className="col-md-8 pt-4 text-center">
            <BrandTitle />
          </div>
        </div>
        <div className="row d-flex justify-content-center pt-1 pb-1">
          <div className="col-md-6 text-center">
            <Heading>
              Congrats, <span className="highlight-name">Jonatan Kristof!</span>{" "}
              <br />
              Your Ticket is ready.
            </Heading>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-4 text-center">
            <Title>
             Lorem ipsum dolor sit adipisicing  <span className="email-hilighted">jontan@gmail.com</span> adipisicing elit.   Lorem ipsum dolor sit amet consectetur .
             </Title>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
}
