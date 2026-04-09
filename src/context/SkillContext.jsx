import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ALL_SKILLS, rolesDataRaw, computeRoleMetrics } from '../data/SkillData.js';

const SkillContext = createContext();

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) throw new Error('useSkillContext must be used within SkillProvider');
  return context;
  

};

export const SkillProvider = ({ children }) => {
  const loadSavedSkills = () => {
    const saved = localStorage.getItem('userSkills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) { console.error(e); }
    }
    const defaults = {};
    ALL_SKILLS.forEach(skill => {
      defaults[skill] = Math.floor(Math.random() * 40) + 30;
    });
    return defaults;
  };

  const [userSkills, setUserSkills] = useState(loadSavedSkills);
  const [selectedRole, setSelectedRole] = useState('');
  const [skillHistory, setSkillHistory] = useState(() => {
    const saved = localStorage.getItem('skillHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
  }, [userSkills]);

  // Record skill history (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newHistory = [...skillHistory];
      const bestMatch = rolesWithMetrics[0];
      newHistory.push({
        timestamp: Date.now(),
        matchScore: bestMatch?.matchScore || 0,
      });
      while (newHistory.length > 20) newHistory.shift();
      setSkillHistory(newHistory);
      localStorage.setItem('skillHistory', JSON.stringify(newHistory));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [userSkills]);

  const rolesWithMetrics = useMemo(() => {
    const result = [];
    for (const roleName of Object.keys(rolesDataRaw)) {
      const metrics = computeRoleMetrics(roleName, userSkills);
      if (metrics) {
        result.push({ name: roleName, ...metrics });
      }
    }
    result.sort((a,b) => b.matchScore - a.matchScore);
    return result;
  }, [userSkills]);

  const bestMatchRole = rolesWithMetrics.length > 0 ? rolesWithMetrics[0] : null;

  useEffect(() => {
    if (bestMatchRole && (!selectedRole || selectedRole !== bestMatchRole.name)) {
      setSelectedRole(bestMatchRole.name);
    }
  }, [bestMatchRole, selectedRole]);

  const updateSkill = (skill, value) => {
    setUserSkills(prev => ({ ...prev, [skill]: parseInt(value, 10) }));
  };

  const getRoleData = (roleName) => rolesWithMetrics.find(r => r.name === roleName);

  return (
    <SkillContext.Provider value={{
      userSkills,
      updateSkill,
      selectedRole,
      setSelectedRole,
      rolesWithMetrics,
      bestMatchRole,
      getRoleData,
      skillHistory,
    }}>
      {children}
    </SkillContext.Provider>
  );
};