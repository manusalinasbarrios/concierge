import Link from 'next/link';
import { getDictionary } from '../get-dictionary';

interface ExploreServicesLinkProps {
  lang: string;
  cityId: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}

export default function ExploreServicesLink({ lang, cityId, dict }: ExploreServicesLinkProps) {
  return (
    <Link href={`/cities/options?lang=${lang}&city=${cityId}`} 
    className="text-2xl text-blue-500 hover:underline"
    style={{
      textTransform: 'uppercase',
    }}
    >
      
      &larr; 
      
      {dict.explore_options}
    </Link>
  );
}