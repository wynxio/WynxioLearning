'use client';
import React from "react";
import SkillsList from "../lib/skillslist";
import useAppStore from "../store/useStore";
 

export const StudentSkillDrp = ({
  skill,
  setSkill,
  showAllOption = false,
  required = false,
  customClass = "form-select",
}) => {

  const allowedSkills = useAppStore((state) => state.student_skills);

  return (
    <select
      className={customClass}
      value={skill}
      onChange={(e) => setSkill(e.target.value)}
      required={required}
    >
      {showAllOption && <option value="">All Skills</option>}

      {allowedSkills?.map((s,index) => (
        // <option key={s.id} value={s.name.toLowerCase()}>
        //   {s.name}
        // </option>
         <option key={index} value={s.toLowerCase()}>
          {s}
        </option>
      ))}
    </select>
  );
};
