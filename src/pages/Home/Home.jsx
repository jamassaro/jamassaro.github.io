import React from 'react'
import { HeroSection, ExpertiseSection, ProjectsSection, VentureSection, NewsFeedSection } from '../../components/sections'
import { AIAssistantSection } from '../../features/ai-assistant'

const Home = () => {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      <VentureSection />
      <AIAssistantSection />
      <NewsFeedSection />
    </>
  )
}

export default Home