import React from 'react';
import { NewToolWrapper } from '../../common';

const AboutOurTeam = () => {
    const visionContent = (
        <div style={{ padding: '10px', backgroundColor: '#8080ff', borderRadius: '8px' }}>
            <h3>Our Vision</h3>
            <p>Innovating to connect the world with seamless and secure network solutions, driving the future of digital communication.</p>
        </div>
    );

    const teamContent = (
        <div style={{ padding: '10px', backgroundColor: '#8080ff', borderRadius: '8px' }}>
            <h3>Team Dynamics</h3>
            <p>A diverse group of network engineers and architects, committed to creating high-performance, resilient networking systems.</p>
        </div>
    );

    const operationalExcellenceContent = (
        <div style={{ padding: '10px', backgroundColor: '#8080ff', borderRadius: '8px' }}>
            <h3>Operational Excellence</h3>
            <p>Expertise in deploying scalable network infrastructure and implementing proactive monitoring for optimal performance.</p>
        </div>
    );

    const valuesContent = (
        <div style={{ padding: '10px', backgroundColor: '#8080ff', borderRadius: '8px' }}>
            <h3>Core Values</h3>
            <p>Integrity, innovation, and excellence in every aspect of our network engineering and operations.</p>
        </div>
    );

    const content = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px', padding: '20px' }}>
            {visionContent}
            {teamContent}
            {operationalExcellenceContent}
            {valuesContent}
        </div>
    );

    return (
        <NewToolWrapper titleElement="About Our Team" content={content}>
            {/* The content is now being passed as a prop to NewToolWrapper */}
        </NewToolWrapper>
    );
};

export default AboutOurTeam;
