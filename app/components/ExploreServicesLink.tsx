import Link from 'next/link';
import { getDictionary } from '../get-dictionary';

interface ExploreServicesLinkProps {
  lang: string;
  cityId: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
  cityName: string;
}

export default function ExploreServicesLink({ lang, cityId, dict, cityName }: ExploreServicesLinkProps) {
  return (
    <Link href={`/cities/options?lang=${lang}&city=${cityId}&cityName=${cityName}`} 
    className="text-xl text-blue-500 hover:underline"
    style={{
      textTransform: 'uppercase',
    }}
    >
      
      &larr; 
      
      {dict.explore_options}
    </Link>
  );
}