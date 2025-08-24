import type { Challenge } from './types';

export const challenges: Challenge[] = [
  { 
    id: '1', 
    day: 1, 
    title: 'Daily Challenge: Day 1',
    description: 'Solve three challenges of varying difficulty to test your skills.',
    questions: [
      { difficulty: 'easy', title: 'Two Sum', description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.', link: 'https://leetcode.com/problems/two-sum/' },
      { difficulty: 'medium', title: 'Reverse a String', description: 'Write a function that reverses a string.', link: 'https://www.codechef.com/problems/FLOW007' },
      { difficulty: 'hard', title: 'Palindrome Check', description: 'Write a function that checks if a string is a palindrome.', link: 'https://leetcode.com/problems/palindromic-substrings/' },
    ]
  },
   { 
    id: '2', 
    day: 2, 
    title: 'Daily Challenge: Day 2',
    description: 'A new set of challenges to sharpen your problem-solving abilities.',
    questions: [
      { difficulty: 'easy', title: 'FizzBuzz', description: 'Print numbers from 1 to 100, but for multiples of three print "Fizz" and for multiples of five print "Buzz". For numbers which are multiples of both, print "FizzBuzz".', link: 'https://leetcode.com/problems/fizz-buzz/' },
      { difficulty: 'medium', title: 'Find Max Number', description: 'Find the maximum number in an array of numbers.', link: 'https://www.codechef.com/problems/FLOW014' },
      { difficulty: 'hard', title: 'Anagram Checker', description: 'Check if two strings are anagrams of each other.', link: 'https://leetcode.com/problems/valid-anagram/' },
    ]
  },
  // Add 43 more challenges...
  {
    id: '3', day: 3, title: 'Daily Challenge: Day 3', description: 'Test your logic with these problems.',
    questions: [
      { difficulty: 'easy', title: 'Count Vowels', description: 'Count the number of vowels in a given string.', link: 'https://www.codechef.com/problems/VOWELTB' },
      { difficulty: 'medium', title: 'Fibonacci Sequence', description: 'Generate the Fibonacci sequence up to n numbers.', link: 'https://leetcode.com/problems/fibonacci-number/' },
      { difficulty: 'hard', title: 'Implement a Queue', description: 'Implement a Queue data structure using an array or linked list.', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' }
    ]
  },
  {
    id: '4', day: 4, title: 'Daily Challenge: Day 4', description: 'Data structures and algorithms practice.',
    questions: [
      { difficulty: 'easy', title: 'Implement a Stack', description: 'Implement a Stack data structure.', link: 'https://leetcode.com/problems/implement-stack-using-queues/' },
      { difficulty: 'medium', title: 'Binary Search', description: 'Implement the binary search algorithm.', link: 'https://leetcode.com/problems/binary-search/' },
      { difficulty: 'hard', title: 'Merge Sorted Arrays', description: 'Merge two sorted arrays into one sorted array.', link: 'https://leetcode.com/problems/merge-sorted-array/' }
    ]
  },
  {
    id: '5', day: 5, title: 'Daily Challenge: Day 5', description: 'Array manipulation challenges.',
    questions: [
      { difficulty: 'easy', title: 'Find Missing Number', description: 'Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing.', link: 'https://leetcode.com/problems/missing-number/' },
      { difficulty: 'medium', title: 'Linked List Cycle', description: 'Determine if a linked list has a cycle in it.', link: 'https://leetcode.com/problems/linked-list-cycle/' },
      { difficulty: 'hard', title: 'Debounce Function', description: 'Implement a debounce function in JavaScript.', link: 'https://leetcode.com/problems/debounce/' }
    ]
  },
  {
    id: '6', day: 6, title: 'Daily Challenge: Day 6', description: 'String and array problems.',
    questions: [
        { difficulty: 'easy', title: 'Find First Non-Repeating Char', description: 'Find the first non-repeating character in a string.', link: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
        { difficulty: 'medium', title: 'Rotate Array', description: 'Rotate an array to the right by k steps.', link: 'https://leetcode.com/problems/rotate-array/' },
        { difficulty: 'hard', title: 'Validate Subsequence', description: 'Check if an array is a subsequence of another.', link: 'https://leetcode.com/problems/is-subsequence/' }
    ]
  },
  {
    id: '7', day: 7, title: 'Daily Challenge: Day 7', description: 'Classic algorithm challenges.',
    questions: [
        { difficulty: 'easy', title: 'Caesar Cipher Encryptor', description: 'Implement a Caesar cipher.', link: 'https://www.codechef.com/problems/ENCODING' },
        { difficulty: 'medium', title: 'Longest Palindromic Substring', description: 'Find the longest palindromic substring in a string.', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
        { difficulty: 'hard', title: 'Invert Binary Tree', description: 'Invert a binary tree.', link: 'https://leetcode.com/problems/invert-binary-tree/' }
    ]
  },
  {
    id: '8', day: 8, title: 'Daily Challenge: Day 8', description: 'Challenges on dynamic programming and arrays.',
    questions: [
        { difficulty: 'easy', title: 'Max Subset Sum No Adjacent', description: 'Find the maximum sum of non-adjacent elements.', link: 'https://leetcode.com/problems/house-robber/' },
        { difficulty: 'medium', title: 'Move Element To End', description: 'Move all instances of an element in an array to the end.', link: 'https://leetcode.com/problems/move-zeroes/' },
        { difficulty: 'hard', title: 'Spiral Traverse', description: 'Traverse a 2D array in a spiral order.', link: 'https://leetcode.com/problems/spiral-matrix/' }
    ]
  },
  {
    id: '9', day: 9, title: 'Daily Challenge: Day 9', description: 'String and array manipulation.',
    questions: [
        { difficulty: 'easy', title: 'Valid IP Addresses', description: 'Generate all valid IP addresses from a string.', link: 'https://leetcode.com/problems/restore-ip-addresses/' },
        { difficulty: 'medium', title: 'Group Anagrams', description: 'Group a list of strings into anagrams.', link: 'https://leetcode.com/problems/group-anagrams/' },
        { difficulty: 'hard', title: 'Longest Substring Without Duplication', description: 'Find the longest substring without duplicate characters.', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
    ]
  },
  {
    id: '10', day: 10, title: 'Daily Challenge: Day 10', description: 'Coin problems and more.',
    questions: [
        { difficulty: 'easy', title: 'Min Number Of Coins For Change', description: 'Find the minimum number of coins to make change.', link: 'https://leetcode.com/problems/coin-change/' },
        { difficulty: 'medium', title: 'Number Of Ways To Make Change', description: 'Find the number of ways to make change for a given amount.', link: 'https://leetcode.com/problems/coin-change-2/' },
        { difficulty: 'hard', title: 'Water Area', description: 'Calculate the amount of water that can be trapped between bars.', link: 'https://leetcode.com/problems/trapping-rain-water/' }
    ]
  },
  {
    id: '11', day: 11, title: 'Daily Challenge: Day 11', description: 'Array and graph problems.',
    questions: [
      { difficulty: 'easy', title: "Kadane's Algorithm", description: 'Find the maximum sum of a contiguous subarray.', link: 'https://leetcode.com/problems/maximum-subarray/' },
      { difficulty: 'medium', title: 'Single Cycle Check', description: 'Check if an array has a single cycle.', link: 'https://www.codechef.com/problems/SINGLECYCLE' },
      { difficulty: 'hard', title: 'Breadth-first Search', description: 'Implement Breadth-first Search on a graph.', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' }
    ]
  },
  {
    id: '12', day: 12, title: 'Daily Challenge: Day 12', description: 'Matrix and tree problems.',
    questions: [
      { difficulty: 'easy', title: 'River Sizes', description: 'Find the sizes of all "rivers" in a 2D matrix.', link: 'https://leetcode.com/problems/number-of-islands/' },
      { difficulty: 'medium', title: 'Youngest Common Ancestor', description: 'Find the youngest common ancestor in an ancestral tree.', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { difficulty: 'hard', title: 'Min Heap Construction', description: 'Implement a Min Heap.', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' }
    ]
  },
  {
    id: '13', day: 13, title: 'Daily Challenge: Day 13', description: 'Linked list and permutation challenges.',
    questions: [
      { difficulty: 'easy', title: 'Remove Kth Node From End', description: 'Remove the Kth node from the end of a linked list.', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { difficulty: 'medium', title: 'Permutations', description: 'Find all permutations of a set of numbers.', link: 'https://leetcode.com/problems/permutations/' },
      { difficulty: 'hard', title: 'Powerset', description: 'Find the powerset of a set.', link: 'https://leetcode.com/problems/subsets/' }
    ]
  },
  {
    id: '14', day: 14, title: 'Daily Challenge: Day 14', description: 'Matrix and array search problems.',
    questions: [
      { difficulty: 'easy', title: 'Search In Sorted Matrix', description: 'Search for a value in a sorted matrix.', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { difficulty: 'medium', title: 'Longest Peak', description: 'Find the longest peak in an array.', link: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/' },
      { difficulty: 'hard', title: 'BST Traversal', description: 'Implement in-order, pre-order, and post-order traversal for a BST.', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' }
    ]
  },
  {
    id: '15', day: 15, title: 'Daily Challenge: Day 15', description: 'Binary Search Tree challenges.',
    questions: [
      { difficulty: 'easy', title: 'Validate BST', description: 'Validate if a binary tree is a valid Binary Search Tree.', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { difficulty: 'medium', title: 'Same BSTs', description: 'Check if two arrays represent the same BST.', link: 'https://www.codechef.com/problems/SAMEBSTS' },
      { difficulty: 'hard', title: 'Max Path Sum in Binary Tree', description: 'Find the maximum path sum in a binary tree.', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' }
    ]
  }
];

// Fill up to 45 challenges by duplicating the first 15
for (let i = 15; i < 45; i++) {
  const baseChallenge = challenges[i % 15];
  challenges.push({
    ...baseChallenge,
    id: (i + 1).toString(),
    day: i + 1,
    title: `Daily Challenge: Day ${i + 1}`,
  });
}
