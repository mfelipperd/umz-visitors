import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export interface Member {
  id: string;
  name: string;
  age: number;
  phone: string;
  gender: string;
  neighborhood: string;
  is_active: boolean;
}

export async function getBestMemberMatch(
  visitorAge: number, 
  visitorGender?: string, 
  visitorNeighborhood?: string
): Promise<Member | null> {
  try {
    const membersRef = collection(db, "members");
    const q = query(membersRef, where("is_active", "==", true));
    const querySnapshot = await getDocs(q);
    
    let members: Member[] = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...(doc.data() as Omit<Member, 'id'>) });
    });

    if (members.length === 0) return null;

    // Scoring system for perfect matching
    const membersWithScores = members.map(m => {
      let score = 0;
      
      // Gender Match (High Priority)
      if (visitorGender && m.gender === visitorGender) {
        score += 100;
      }
      
      // Neighborhood Match (Medium Priority)
      if (visitorNeighborhood && m.neighborhood === visitorNeighborhood) {
        score += 50;
      }
      
      // Age Difference (Low Priority penalty)
      const ageDiff = Math.abs(m.age - visitorAge);
      score -= ageDiff;

      return { ...m, score };
    });

    // Sort by score descending
    const sortedMembers = membersWithScores.sort((a, b) => b.score - a.score);

    // Take the top 3 candidates
    const topCandidates = sortedMembers.slice(0, 3);

    // Pick randomly among the top 3 to distribute the load
    const matchedMember = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    
    // Remove the temporary 'score' property before returning
    const { score, ...cleanMember } = matchedMember;
    return cleanMember as Member;
    
  } catch (error) {
    console.error("Error matching member:", error);
    return null;
  }
}
