export function addCourse(selected,id,catalog){const course=catalog.find(c=>c.id===id);if(!course?.trackerReady)throw Error('Tracking not reviewed for this course.');if(selected.includes(id))return selected;
 if(course.electiveGroup){const conflict=catalog.find(c=>selected.includes(c.id)&&c.branchSlug===course.branchSlug&&c.semester===course.semester&&c.electiveGroup===course.electiveGroup);if(conflict)throw Error(`You already selected ${conflict.name} for ${course.electiveGroup}. Remove it before choosing another.`);}
 return [...selected,id];}
