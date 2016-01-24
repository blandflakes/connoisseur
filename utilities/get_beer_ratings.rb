require 'mechanize'
require 'set'

# Types: beer, wine, spirits
def search_page_url(drink_type)
  return "http://tastings.com/search_#{drink_type}.lasso"
end

def search_form_name(drink_type)
  return "search#{drink_type}"
end

def dump_notes(search_results)
  results_section = search_results.search("td.desctext")

  results_section.each do |td|
    text = td.text.strip
    name, notes = text.split(/\s\s+/)
    # Remove tasted at the end
    notes = notes.split("(tasted")[0].rstrip
    # Dump to STDOUT
    puts notes
  end
end

drinks = Set.new(["spirits", "wine", "beer"])
drink_type = ARGV.shift
unless drinks.include?(drink_type)
  raise "Supported drinks are: " + drinks.to_a.to_s
end

agent = Mechanize.new

search_page = agent.get(search_page_url(drink_type))
search_form = search_page.form(search_form_name(drink_type))
search_results = agent.submit(search_form)
dump_notes(search_results)

next_link = search_results.links.find {|link| link.text() == "|Next|"}
while next_link do
  sleep(30)
  search_results = next_link.click
  dump_notes(search_results)
  next_link = search_results.links.find {|link| link.text() == "|Next|"}
end 
