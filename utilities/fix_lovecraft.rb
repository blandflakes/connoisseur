# Takes printing-formatted lovecraft data set and munges it into an excerpt per line, similar to our tasting notes.

previous = nil
ARGF.each do |line|
  if line == "\n"
    print previous.lstrip unless previous.nil?
    previous = nil
  else
    print previous.lstrip.gsub("\n", " ") unless previous.nil?
    previous = line
  end
end
print previous.lstrip.chomp unless previous.nil?
