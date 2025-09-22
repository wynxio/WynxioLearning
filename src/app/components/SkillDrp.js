import React from "react";
import SkillsList from "../lib/skillslist";


export const SkillDrp = ({
  skill,
  setSkill,
  showAllOption = false,
  required = false,
  customClass = "form-select",
}) => {
  return (
    <select
      className={customClass}
      value={skill}
      onChange={(e) => setSkill(e.target.value)}
      required={required}
    >
      {showAllOption && <option value="">All Skills</option>}

      {SkillsList.map((s) => (
        <option key={s.id} value={s.name.toLowerCase()}>
          {s.name}
        </option>
      ))}
    </select>
  );
};
