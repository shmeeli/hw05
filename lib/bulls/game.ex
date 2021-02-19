#Based on code created by Nat Tuck in Lecture
defmodule Bulls.Game do
 
  #when a new game is created, create a new secret and guesses
  def new do
    %{
      secret: random_secret(),
      guesses: [],
      a: [],
      b: [],
      lives: 8,
      won: false,
    }
  end

  def guess(st, g) do
    if (Enum.member?(st.guesses,g)) do
	st
    else 
        new_guesses = st.guesses ++ [g]
        new_a = st.a ++ [count_A(st.secret, g)]
        new_b = st.b ++ [count_B(st.secret, g) - count_A(st.secret, g)]
        %{
      	    secret: st.secret,
      	    guesses: new_guesses,
            a: new_a,
      	    b: new_b,
            lives: lives(st, g),
            won: won(st,g),
        }
    end
  end

  
  def count_A(secret, g) do
    if String.length(g) == 0 do
      0
    else 
      if hd(String.to_charlist(secret)) == hd(String.to_charlist(g)) do
        count_A(to_string(tl(String.to_charlist(secret))),
	        to_string(tl(String.to_charlist(g)))) + 1
      else 
        count_A(to_string(tl(String.to_charlist(secret))),
	        to_string(tl(String.to_charlist(g))))
      end 
    end
  end

  def count_B(secret, g) do
    {val, _} = Integer.parse(g);
    if String.length(g) == 0 || val - 0 < 0.01 do
      0
    else 
      digit = rem(val,10) 
      if String.contains?(secret,to_string(digit)) do
        count_B(secret,
	        to_string((val-digit)/10)) + 1
      else 
        count_B(secret,
	        to_string((val-digit)/10))
      end 
    end
  end

  def won(st, g) do
    st.secret == g
  end

  def lives(st, g) do
    if won(st,g) do
      st.lives
    else 
      st.lives - 1
    end
  end


  def view(st) do
      %{
        guesses: st.guesses,
        a: st.a,
        b: st.b,
        lives: st.lives,
        won: st.won,
      }
    end
  end

  def random_secret() do
    s = grow_secret(to_string(Enum.random(0..9)))
    #IO.puts(s)
    s
  end


  def grow_secret(so_far) do 
    if String.length(so_far) >= 4 do
      so_far
    else 
      new_digit = to_string(Enum.random(0..9))
      if !String.contains?(so_far,new_digit) do
	grow_secret("#{so_far}#{new_digit}")
      else 
      	grow_secret(so_far)
      end
    end
  end
end
