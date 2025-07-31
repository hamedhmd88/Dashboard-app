// import { motion } from "framer-motion";

// type StateCardProps = {
//   name: string;
//   icon: React.ElementType;
//   value: string;
// };

// function StateCard({ name, icon: Icon, value }: StateCardProps) {
//   return (
//     <motion.div
//       whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
//       className="bg-[var(--component-bg)] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border-[var(--border)]"
//     >
//       <div className=" px-4 py-5 sm:p-6">
//         <span className=" flex items-center text-base font-medium text-[var(--text-secondary)] tracking-wide drop-shadow-md">
//           {Icon && <Icon size={30} className="ml-4" />}
//           <span className="ml-2 text-lg">{name}</span>
//         </span>
//         <p className=" mt-1 text-3xl font-semibold text-[var(--foreground)]">
//           {value}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// export default StateCard;


import { memo } from 'react';
import { motion } from 'framer-motion';

type StateCardProps = {
  name: string;
  icon: React.ElementType;
  value: string;
};

const StateCard = memo(({ name, icon: Icon, value }: StateCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      className="dashboard-card overflow-hidden p-4 py-5 sm:p-6"
    >
      <span className="flex items-center text-base font-medium text-[var(--text-secondary)] tracking-wide drop-shadow-md">
        <Icon size={30} className="ml-4" />
        <span className="ml-2 text-lg">{name}</span>
      </span>
      <p className="mt-1 text-3xl font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </motion.div>
  );
});

StateCard.displayName = 'StateCard';

export default StateCard;