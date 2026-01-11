import React from "react";
import { Users } from "lucide-react";

const SidebarSkeleton = () => {

    const skeletonContacts = Array(8).fill(null);

    return (
        <aside className="h-full w-20 lg:w-72 border-r 
        border-base-300 flex flex-col transition-all duration-200 
        animate-pulse">
        </aside>
    );
}
export default SidebarSkeleton;

