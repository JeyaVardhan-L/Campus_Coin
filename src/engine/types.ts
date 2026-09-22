export interface BlockHeader {
  index: number;
  previousHash: string;
  timestamp: number;
  data: string;
  nonce: number;
  difficulty: number;
}

export interface Block extends BlockHeader {
  hash: string;
}

export interface BlockValidation {
  isValid: boolean;
  isHashValid: boolean;
  isDifficultyValid: boolean;
  computedHash: string;
  error?: string;
}

export interface BlockStatusInChain {
  index: number;
  isValid: boolean;
  isHashValid: boolean;
  isLinkValid: boolean;
  isDifficultyValid: boolean;
  computedHash: string;
  reason?: string;
}

export interface ChainValidationResult {
  isValid: boolean;
  firstInvalidIndex: number | null;
  blockStatuses: BlockStatusInChain[];
  summary: string;
}
