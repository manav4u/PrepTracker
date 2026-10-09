import data from '../catalog/courses.json';
import type {Subject} from '../types';
export type CatalogCourse = Subject & {year:string;branch:string;branchSlug:string;pattern:string;source:string;sourceLabel:string;draft:boolean;trackerReady:boolean;type:string;semester?:number;electiveGroup?:string;path:string;cce:number;ese:number};
export const CATALOG=data.courses as CatalogCourse[];
export const CATALOG_NOTE=data.coverageNote;
