import React from 'react'
import { HeroSection, ExpertiseSection, ProjectsSection, VentureSection } from '../../components/sections'
import { AIAssistantSection } from '../../features/ai-assistant'

const Home = () => {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      <VentureSection />
      <AIAssistantSection />
    </>
  )
}

export default Home