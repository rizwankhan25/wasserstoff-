"use client";
import React from "react";
import Form from "../components/Form";
import Title from "../components/Title";
import BrandTitle from "@/components/BrandTitle";
import Heading from "@/components/Heading";

export default function HomePage() {
  return (
    <div className="page-background text-white">
      <div className="container">  
        <div className="row d-flex justify-content-center pb-2">
          <div className="col-md-8 text-center pt-4">
            <BrandTitle />
          </div>
        </div>
        <div className="row d-flex justify-content-center pt-1 pb-1">
          <div className="col-md-5 text-center">
            <Heading>
              Your Journey to Coding Conf 2025 Starts here!
            </Heading>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 text-center">
            <Title>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam alias.
            </Title>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-5">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}
