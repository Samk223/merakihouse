import { FC } from "react";

interface InstagramItem {
  id: number;
  coverUrl: string;
  username: string;
  aspectClass: string;
  marginClass: string;
}

const instagramData: InstagramItem[] = [
  {
    id: 1,
    coverUrl: "/home/instagram/cover_1.png",
    username: "@meraki.ritu",
    aspectClass: "pb-[133.33%]", // 3:4 ratio
    marginClass: "",
  },
  {
    id: 2,
    coverUrl: "/home/instagram/cover_2.png",
    username: "@priya.meraki",
    aspectClass: "pb-[133.33%]", // 3:4 ratio
    marginClass: "mt-0 lg:mt-6",
  },
  {
    id: 3,
    coverUrl: "/home/instagram/cover_3.png",
    username: "@isha_meraki",
    aspectClass: "pb-[100%]", // 1:1 ratio
    marginClass: "mt-0 lg:mt-12",
  },
  {
    id: 4,
    coverUrl: "/home/instagram/cover_4.png",
    username: "@ananya.house",
    aspectClass: "pb-[125%]", // 4:5 ratio
    marginClass: "mt-0 lg:mt-24",
  },
  {
    id: 5,
    coverUrl: "/home/instagram/cover_5.png",
    username: "@merakihouse",
    aspectClass: "pb-[100%]", // 1:1 ratio
    marginClass: "mt-0 lg:mt-6",
  },
  {
    id: 6,
    coverUrl: "/home/instagram/cover_6.png",
    username: "@diksha.house",
    aspectClass: "pb-[100%]", // 1:1 ratio
    marginClass: "mt-0 lg:mt-6",
  },
];

export const InstagramFeed: FC = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF6F0] flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col">
        
        {/* Left-Aligned Header Block matching FAQ layout */}
        <div className="text-left w-full mb-12 lg:mb-16">
          <span className="block font-body font-medium text-[#7A4B54] text-xs sm:text-sm tracking-[0.2em] uppercase select-none w-full">
            Social
          </span>
          <h2 className="block font-body font-light text-3xl md:text-[2.25rem] leading-[1.3] text-[#2C293E] mt-3 w-full md:w-[500px] max-w-full relative cursor-heart group/title px-4 py-1">
            Follow our impressive Instagram for updates and promotions
          </h2>
        </div>

        {/* Asymmetrical Masonry Grid of Influencer Post Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start w-full">
          
          {/* Column 1: Grid items 1 & 2 */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {[instagramData[0], instagramData[1]].map((item) => (
              <div 
                key={item.id}
                className={`w-full bg-white p-3 pb-5 rounded-lg shadow-[0_8px_30px_rgba(40,39,63,0.03)] border border-neutral-200/5 cursor-heart group flex flex-col ${item.marginClass}`}
              >
                {/* 3:4 Aspect Image container */}
                <div className={`w-full relative rounded-md overflow-hidden bg-[#F5EFE6] h-0 ${item.aspectClass}`}>
                  <img 
                    src={item.coverUrl}
                    alt="Meraki House Influencer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-103"
                    loading="lazy"
                  />
                </div>
                {/* Influencer IG ID Handle below */}
                <div className="text-[10px] tracking-[0.15em] text-[#7A4B54] mt-3 font-medium text-center select-none font-body transition-colors duration-300 group-hover:text-primary">
                  {item.username}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Grid item 3 */}
          <div className="flex flex-col lg:col-span-1">
            <div className={`w-full bg-white p-3 pb-5 rounded-lg shadow-[0_8px_30px_rgba(40,39,63,0.03)] border border-neutral-200/5 cursor-heart group flex flex-col ${instagramData[2].marginClass}`}>
              <div className={`w-full relative rounded-md overflow-hidden bg-[#F5EFE6] h-0 ${instagramData[2].aspectClass}`}>
                <img 
                  src={instagramData[2].coverUrl}
                  alt="Meraki House Influencer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-103"
                  loading="lazy"
                />
              </div>
              <div className="text-[10px] tracking-[0.15em] text-[#7A4B54] mt-3 font-medium text-center select-none font-body transition-colors duration-300 group-hover:text-primary">
                {instagramData[2].username}
              </div>
            </div>
          </div>

          {/* Column 3: Grid item 4 */}
          <div className="flex flex-col lg:col-span-1">
            <div className={`w-full bg-white p-3 pb-5 rounded-lg shadow-[0_8px_30px_rgba(40,39,63,0.03)] border border-neutral-200/5 cursor-heart group flex flex-col ${instagramData[3].marginClass}`}>
              <div className={`w-full relative rounded-md overflow-hidden bg-[#F5EFE6] h-0 ${instagramData[3].aspectClass}`}>
                <img 
                  src={instagramData[3].coverUrl}
                  alt="Meraki House Influencer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-103"
                  loading="lazy"
                />
              </div>
              <div className="text-[10px] tracking-[0.15em] text-[#7A4B54] mt-3 font-medium text-center select-none font-body transition-colors duration-300 group-hover:text-primary">
                {instagramData[3].username}
              </div>
            </div>
          </div>

          {/* Column 4: Grid items 5 (Polaroid Card) & 6 */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* Polaroid White Card Grid Item */}
            <div className={`w-full bg-white p-3 pb-8 rounded-sm shadow-[0_8px_30px_rgba(40,39,63,0.04)] border border-[#2c293e]/5 cursor-heart group flex flex-col ${instagramData[4].marginClass}`}>
              <div className={`w-full relative rounded-sm overflow-hidden bg-[#F5EFE6] h-0 ${instagramData[4].aspectClass}`}>
                <img 
                  src={instagramData[4].coverUrl}
                  alt="Meraki House Influencer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-103"
                  loading="lazy"
                />
              </div>
              <div className="text-center mt-3 select-none">
                <span className="block font-serif italic text-sm text-[#7A4B54]">Golden Hour</span>
                <span className="block text-[7px] uppercase tracking-widest text-[#9D6C76] mt-1 font-semibold font-body">
                  follow {instagramData[4].username}
                </span>
              </div>
            </div>

            {/* Grid Item 6 */}
            <div className={`w-full bg-white p-3 pb-5 rounded-lg shadow-[0_8px_30px_rgba(40,39,63,0.03)] border border-neutral-200/5 cursor-heart group flex flex-col ${instagramData[5].marginClass}`}>
              <div className={`w-full relative rounded-md overflow-hidden bg-[#F5EFE6] h-0 ${instagramData[5].aspectClass}`}>
                <img 
                  src={instagramData[5].coverUrl}
                  alt="Meraki House Influencer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-[cubic-bezier(0.3,0,0,1)] group-hover:scale-103"
                  loading="lazy"
                />
              </div>
              <div className="text-[10px] tracking-[0.15em] text-[#7A4B54] mt-3 font-medium text-center select-none font-body transition-colors duration-300 group-hover:text-primary">
                {instagramData[5].username}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
