import React from "react";
import {
  HeroSection,
  ExpertiseSection,
  ProjectsSection,
  VentureSection,
  WorkExperienceSection,
  NewsFeedSection,
} from "../../components/sections";
import { AIAssistantSection } from "../../features/ai-assistant";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <WorkExperienceSection />
      <ProjectsSection />
      <VentureSection />
      <AIAssistantSection />
      <NewsFeedSection />
    </>
  );
};

export default Home;
