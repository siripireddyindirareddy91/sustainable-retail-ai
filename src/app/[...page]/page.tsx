import {notFound} from 'next/navigation';
import {Workspace} from '@/components/workspace';
const pages=['products','recommendations','sustainability','explainability','compare','assistant','wishlist','cart','dashboard','admin','login','signup'];
export default async function Page({params}:{params:Promise<{page:string[]}>}){const {page}=await params;if(page.length!==1||!pages.includes(page[0]))notFound();return <Workspace view={page[0]}/>;}
